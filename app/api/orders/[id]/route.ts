import { auth } from "@/lib/auth";
import { COURIER_SERVICES, ORDER_STATUSES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MAX_RIDER_NAME_LENGTH = 100;
const MAX_RIDER_PHONE_LENGTH = 30;
const MAX_TRACKING_ID_LENGTH = 100;

// Trims a text field and caps its length; an empty result clears the field
// (stored as null) rather than saving an empty string.
function readTextField(value: unknown, maxLength: number): string | null | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, maxLength);
  return trimmed.length > 0 ? trimmed : null;
}

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

  const fields = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};

  const data: Prisma.OrderUpdateInput = {};

  // Status: unchanged from before — only validated/written when present.
  if ("status" in fields) {
    const status = fields.status;
    if (!(ORDER_STATUSES as readonly unknown[]).includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `status must be one of: ${ORDER_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }
    data.status = status as string;
  }

  // Courier is booked outside the app (Bykea, Yango, ...); this just records
  // what the admin booked. Any field left out of the body is untouched.
  const courierFieldsInBody =
    "courierService" in fields ||
    "riderName" in fields ||
    "riderPhone" in fields ||
    "trackingId" in fields;

  if ("courierService" in fields) {
    const courierService = readTextField(fields.courierService, 20);
    if (
      courierService !== null &&
      !(COURIER_SERVICES as readonly unknown[]).includes(courierService)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `courierService must be one of: ${COURIER_SERVICES.join(", ")}`,
        },
        { status: 400 }
      );
    }
    data.courierService = courierService;
  }
  if ("riderName" in fields) {
    data.riderName = readTextField(fields.riderName, MAX_RIDER_NAME_LENGTH);
  }
  if ("riderPhone" in fields) {
    data.riderPhone = readTextField(fields.riderPhone, MAX_RIDER_PHONE_LENGTH);
  }
  if ("trackingId" in fields) {
    data.trackingId = readTextField(fields.trackingId, MAX_TRACKING_ID_LENGTH);
  }

  try {
    if (courierFieldsInBody) {
      const existing = await prisma.order.findUnique({
        where: { id },
        select: { courierBookedAt: true },
      });
      if (!existing) {
        return NextResponse.json(
          { success: false, error: "Order not found" },
          { status: 404 }
        );
      }
      if (!existing.courierBookedAt) {
        data.courierBookedAt = new Date();
      }
    }

    const order = await prisma.order.update({
      where: { id },
      data,
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
    console.error("Update order error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
