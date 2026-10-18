import { prisma } from "@/lib/prisma";
import { hashPassword, MIN_PASSWORD_LENGTH, passwordTooShortError } from "@/lib/password";
import { NextRequest, NextResponse } from "next/server";

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
  const token = typeof fields.token === "string" ? fields.token : "";
  const password = typeof fields.password === "string" ? fields.password : "";

  if (!token || !password) {
    return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json({ error: passwordTooShortError() }, { status: 400 });
  }

  const customer = await prisma.customer.findFirst({ where: { resetToken: token } });

  if (!customer || !customer.resetTokenExpiresAt || customer.resetTokenExpiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired" },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(password);
  await prisma.customer.update({
    where: { id: customer.id },
    data: { passwordHash, resetToken: null, resetTokenExpiresAt: null },
  });

  return NextResponse.json({ success: true });
}
