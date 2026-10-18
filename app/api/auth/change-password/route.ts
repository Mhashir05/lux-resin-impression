import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hashPassword, MIN_PASSWORD_LENGTH, passwordTooShortError } from "@/lib/password";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
  const currentPassword = typeof fields.currentPassword === "string" ? fields.currentPassword : "";
  const newPassword = typeof fields.newPassword === "string" ? fields.newPassword : "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Current and new password are required" },
      { status: 400 }
    );
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json({ error: passwordTooShortError("New password") }, { status: 400 });
  }

  // Scoped to the logged-in session's own id.
  const customer = await prisma.customer.findUnique({ where: { id: session.user.id } });
  if (!customer) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(currentPassword, customer.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.customer.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return NextResponse.json({ success: true });
}
