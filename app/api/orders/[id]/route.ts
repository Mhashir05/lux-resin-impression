import { auth } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  // Only `status` is read; anything else in the body is ignored.
  const status =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).status
      : undefined;

  if (!(ORDER_STATUSES as readonly unknown[]).includes(status)) {
    return NextResponse.json(
      {
        success: false,
        error: `status must be one of: ${ORDER_STATUSES.join(", ")}`,
      },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status: status as string },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    // P2025: the record to update does not exist.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    console.error("Update order status error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
