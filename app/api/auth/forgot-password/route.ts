import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

// Always the same response, whether or not the email exists — don't let this
// endpoint be used to check which addresses have accounts.
const GENERIC_MESSAGE = "If that email exists, we've sent a password reset link.";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const fields = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const email = typeof fields.email === "string" ? fields.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
  }

  const customer = await prisma.customer.findUnique({ where: { email } });

  if (customer) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await prisma.customer.update({
      where: { id: customer.id },
      data: { resetToken, resetTokenExpiresAt },
    });

    const resetUrl = `${new URL(request.url).origin}/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail(customer.email, resetUrl);
    } catch (error) {
      // Don't reveal a send failure either — the response stays generic.
      console.error("Failed to send password reset email:", error);
    }
  }

  return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
}
