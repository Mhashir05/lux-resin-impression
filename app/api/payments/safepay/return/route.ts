import { NextResponse } from "next/server";

// OFFLINE BY REQUEST — matching switch to
// app/api/payments/safepay/create-tracker/route.ts. Both must be flipped
// together; see that file for restore instructions and why.
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return NextResponse.redirect(
    `${origin}/checkout?safepayError=${encodeURIComponent(
      "Online payment is temporarily unavailable. Please choose a different payment method."
    )}`
  );
}

// ---------------------------------------------------------------------------
// Real implementation (currently unreachable — see offline switch above).
//
// Safepay redirects the customer's browser here after they pay (or cancel,
// though cancelUrl is a separate route — see create-tracker). The exact
// query parameters Safepay appends are NOT documented anywhere in
// node-sdk's README or the two Advanced Checkout doc pages checked for this
// integration — the README's whole "Verification" section only shows
// `safepay.verify.signature(request)` called on an unspecified `req` object,
// with no example return URL or field list. `tracker` and `sig` are used
// here because they're the exact two field names Verify.prototype.signature
// itself reads (request.body.sig / request.body.tracker) and the only names
// attested anywhere in this SDK — but this is an inference, not a confirmed
// fact. If Safepay's real redirect uses different key names, this fails
// cleanly below rather than silently misreading something; check the actual
// query string during manual testing and tell me if it needs correcting.
//
// Fixes both original security-auditor findings the same way the old
// widget-based /verify route did:
//   1. Amount is bound server-side: create-tracker computes it from the DB
//      before the customer ever leaves this app, and this route re-prices
//      the same stored cart and rejects on any mismatch.
//   2. paymentReference is single-use: checked against both the pending
//      tracker row (deleted on consumption) and a unique DB constraint on
//      Order.paymentReference.
// ---------------------------------------------------------------------------

import { auth } from "../../../../../lib/auth";
import { ValidationError, buildOrderLines, generateOrderNumber } from "../../../../../lib/order-creation";
import { prisma } from "../../../../../lib/prisma";
import { safepay } from "../../../../../lib/safepay";

function errorRedirect(origin: string, message: string) {
  return NextResponse.redirect(`${origin}/checkout?safepayError=${encodeURIComponent(message)}`);
}

async function getImpl(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;

  const session = await auth();
  if (!session || session.user.role !== "customer") {
    return errorRedirect(origin, "You must be logged in to pay online.");
  }

  const tracker = url.searchParams.get("tracker");
  const sig = url.searchParams.get("sig");
  if (!tracker || !sig) {
    return errorRedirect(origin, "Missing payment reference from Safepay.");
  }

  // Proves this (tracker, sig) pair was HMAC-signed with our v1Secret — not
  // that it's unused or that it covers the amount we expect. Both are
  // checked separately below.
  const validSignature = safepay.verify.signature({ body: { tracker, sig } });
  if (!validSignature) {
    return errorRedirect(origin, "Payment verification failed.");
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const pending = await tx.safepayPendingTracker.findUnique({ where: { id: tracker } });
      if (!pending) {
        throw new ValidationError(
          "This payment has already been processed or was never started here."
        );
      }
      if (pending.customerId !== session.user.id) {
        throw new ValidationError("This payment does not belong to your account.");
      }

      const quantities = new Map(
        Object.entries(pending.items as Record<string, number>)
      );
      const { lines, totalAmount } = await buildOrderLines(quantities);
      if (totalAmount !== pending.amount) {
        throw new ValidationError(
          "Pricing changed since this payment was started. Please contact us."
        );
      }

      const existing = await tx.order.findUnique({ where: { paymentReference: tracker } });
      if (existing) {
        throw new ValidationError("This payment has already been used for an order.");
      }

      const orderNumber = await generateOrderNumber();
      const created = await tx.order.create({
        data: {
          orderNumber,
          customerName: pending.customerName,
          phone: pending.phone,
          address: pending.address,
          items: lines,
          totalAmount,
          paymentMethod: "Safepay",
          paymentStatus: "paid",
          paymentReference: tracker,
          customerId: session.user.id,
          statusHistory: { create: { status: "New" } },
        },
      });

      // Consumed — deleting inside the same transaction as the order create
      // closes the race where two requests both read the pending row before
      // either commits.
      await tx.safepayPendingTracker.delete({ where: { id: tracker } });

      return created;
    });

    return NextResponse.redirect(
      `${origin}/order-confirmed?orderNumber=${encodeURIComponent(order.orderNumber)}`
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorRedirect(origin, error.message);
    }
    console.error("Safepay return failed:", error);
    return errorRedirect(origin, "Could not complete your order. Please contact us.");
  }
}

// Referenced so the unused-import/unused-function lint rules don't flag the
// finished implementation while it's switched off.
void getImpl;
