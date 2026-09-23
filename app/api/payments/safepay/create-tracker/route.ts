import { NextResponse } from "next/server";

// OFFLINE BY REQUEST — see app/api/payments/safepay/return/route.ts for the
// matching switch and the same restore instructions. Both routes must be
// flipped together: this one can hand out real Safepay checkout URLs, so it
// stays off until the full flow (including a replay attempt) has been
// manually tested and approved.
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Online payment is temporarily unavailable. Please choose a different payment method.",
    },
    { status: 503 }
  );
}

// ---------------------------------------------------------------------------
// Real implementation (currently unreachable — see offline switch above).
//
// Creates a Safepay tracker server-side, with an amount computed from the
// DB — never one the client sends — then builds a hosted Safepay checkout
// URL for it via the SDK's own documented flow (node-sdk/readme.md:
// payments.create() -> checkout.create() -> redirect the browser to the
// returned URL). The customer's browser leaves this app entirely to pay, so
// shipping details and cart contents are saved here and read back by the
// return route — there's no request body on the redirect back to re-supply
// them. See app/api/payments/safepay/return/route.ts for the consumption
// side (signature check, replay protection, order creation).
// ---------------------------------------------------------------------------

import { auth } from "../../../../../lib/auth";
import {
  ValidationError,
  buildOrderLines,
  parseCartItems,
  parseShippingDetails,
} from "../../../../../lib/order-creation";
import { prisma } from "../../../../../lib/prisma";
import { safepay } from "../../../../../lib/safepay";

async function postImpl(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "customer") {
    return NextResponse.json(
      { success: false, error: "You must be logged in to pay online." },
      { status: 401 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { success: false, error: "Request body must be a JSON object" },
      { status: 400 }
    );
  }
  const input = body as Record<string, unknown>;

  try {
    const { customerName, phone, address } = parseShippingDetails(input);
    const quantities = parseCartItems(input);
    const { totalAmount } = await buildOrderLines(quantities);

    // POST {API_URL}/order/v1/init — returns { token }, Safepay's tracker id,
    // already bound to this amount on their side.
    const { token: tracker } = await safepay.payments.create({
      amount: totalAmount,
      currency: "PKR",
    });

    const origin = new URL(request.url).origin;
    // Builds "{CHECKOUT_URL}/pay?beacon=<token>&..." — no network call, just
    // URL construction (see node-sdk/dist/resources/checkout.js). We don't
    // have our own Order yet (that's only created on successful return), so
    // the tracker itself doubles as the orderId Safepay asks for here.
    const checkoutUrl = safepay.checkout.create({
      token: tracker,
      orderId: tracker,
      cancelUrl: `${origin}/checkout?safepayCancelled=1`,
      redirectUrl: `${origin}/api/payments/safepay/return`,
    });

    await prisma.safepayPendingTracker.create({
      data: {
        id: tracker,
        amount: totalAmount,
        customerId: session.user.id,
        customerName,
        phone,
        address,
        items: Object.fromEntries(quantities),
      },
    });

    return NextResponse.json({ success: true, checkoutUrl });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.error("Safepay create-tracker failed:", error);
    return NextResponse.json(
      { success: false, error: "Could not start online payment. Please try again." },
      { status: 502 }
    );
  }
}

// Referenced so the unused-import/unused-function lint rules don't flag the
// finished implementation while it's switched off.
void postImpl;
