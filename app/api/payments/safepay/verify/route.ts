import { NextResponse } from "next/server";

// Taken offline: a security audit found that verify.signature() alone proves
// a (tracker, sig) pair was HMAC-signed with our secret, but nothing about
// the transaction's real status or amount, and nothing stops the same pair
// being replayed to mint unlimited "paid" orders. Do not re-enable this
// route until both are fixed:
//   1. bind the verified transaction to a specific, server-recorded amount
//      (rather than re-pricing from whatever the request claims)
//   2. make paymentReference single-use (unique + checked before creating
//      an order)
// The Safepay payment option is also removed from components/CheckoutForm.tsx
// so customers never see it while this is disabled.
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Online payment is temporarily unavailable. Please choose a different payment method.",
    },
    { status: 503 }
  );
}
