import { Safepay } from "@sfpy/node-sdk";
// Not re-exported from the package root; the "sandbox" string literal isn't
// assignable to the SDK's Environment-enum-based type, so import it directly.
import { Environment } from "@sfpy/node-sdk/dist/utils/constants";

// Server-only: do not import this from a Client Component — v1Secret must
// never reach the browser.
//
// SAFEPAY_PUBLIC_KEY is Safepay's "client" key — the same value the Safepay
// Button widget uses in the browser (see components/SafepayButton.tsx), and
// what the SDK calls `apiKey`.
// SAFEPAY_SECRET_KEY is Safepay's dashboard "secret key" — the SDK calls
// this `v1Secret`; it signs the HMAC-SHA256 check in verify.signature() and
// must stay server-side only.
const SAFEPAY_PUBLIC_KEY = process.env.SAFEPAY_PUBLIC_KEY;
const SAFEPAY_SECRET_KEY = process.env.SAFEPAY_SECRET_KEY;

if (!SAFEPAY_PUBLIC_KEY || !SAFEPAY_SECRET_KEY) {
  throw new Error(
    "Missing Safepay env vars: SAFEPAY_PUBLIC_KEY and SAFEPAY_SECRET_KEY must both be set"
  );
}

// No webhook receiver is implemented in this app yet, so webhookSecret is
// unused by anything we call — the SDK's config type just requires a value.
// Swap this for a real dashboard-issued webhook secret if one is added.
export const safepay = new Safepay({
  environment: Environment.Sandbox,
  apiKey: SAFEPAY_PUBLIC_KEY,
  v1Secret: SAFEPAY_SECRET_KEY,
  webhookSecret: SAFEPAY_SECRET_KEY,
});
