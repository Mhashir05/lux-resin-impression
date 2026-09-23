import { Resend } from "resend";

// Server-only: do not import this from a Client Component.
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!RESEND_API_KEY) {
  throw new Error("Missing Resend env var: RESEND_API_KEY must be set");
}

const resend = new Resend(RESEND_API_KEY);

// Resend's shared onboarding domain — no custom domain is verified yet, so
// this can only deliver to the email address that owns the Resend account.
// Swap for a verified sender once a domain is set up.
const FROM_ADDRESS = "Lux Resin Impression <onboarding@resend.dev>";

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: "Reset your password",
    text: `We received a request to reset your password for your Lux Resin Impression account.\n\nReset it here: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, you can ignore this email.`,
  });
}
