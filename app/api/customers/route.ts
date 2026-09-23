import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

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
  const name = readString(fields.name);
  const email = readString(fields.email).toLowerCase();
  const phone = readString(fields.phone);
  const address = readString(fields.address);
  const password = typeof fields.password === "string" ? fields.password : "";

  if (!name || !email || !phone || !address || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 }
    );
  }

  const existing = await prisma.customer.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = await prisma.customer.create({
    data: { name, email, phone, address, passwordHash },
  });

  return NextResponse.json({
    success: true,
    customer: { id: customer.id, name: customer.name, email: customer.email },
  });
}
