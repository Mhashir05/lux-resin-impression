import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(request: NextRequest) {
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
  const name = readString(fields.name);
  const phone = readString(fields.phone);
  const address = readString(fields.address);

  if (!name || !phone || !address) {
    return NextResponse.json(
      { error: "Name, phone and address are required" },
      { status: 400 }
    );
  }

  // Scoped to the logged-in session's own id — an id in the request body,
  // if any, is never read.
  const customer = await prisma.customer.update({
    where: { id: session.user.id },
    data: { name, phone, address },
  });

  return NextResponse.json({
    success: true,
    customer: { name: customer.name, phone: customer.phone, address: customer.address },
  });
}
