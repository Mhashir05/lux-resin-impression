import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const MIN_PASSWORD_LENGTH = 8;

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
    return NextResponse.json(
      { error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    );
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

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.customer.update({
    where: { id: session.user.id },
    data: { passwordHash },
  });

  return NextResponse.json({ success: true });
}
