import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const MIN_PASSWORD_LENGTH = 8;

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
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    );
  }

  const customer = await prisma.customer.findFirst({ where: { resetToken: token } });

  if (!customer || !customer.resetTokenExpiresAt || customer.resetTokenExpiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired" },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.customer.update({
    where: { id: customer.id },
    data: { passwordHash, resetToken: null, resetTokenExpiresAt: null },
  });

  return NextResponse.json({ success: true });
}
