import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { PAYMENT_METHODS, type PaymentMethod } from "../../../lib/constants";
import {
  ValidationError,
  buildOrderLines,
  generateOrderNumber,
  parseCartItems,
  parseShippingDetails,
} from "../../../lib/order-creation";
import { prisma } from "../../../lib/prisma";

const MANUAL_PAYMENT_METHODS = PAYMENT_METHODS.filter((m) => m !== "Safepay");

// "Safepay" implies a gateway-confirmed payment, so it's excluded here — an
// order with that method can only be created by
// app/api/payments/safepay/verify/route.ts, after real verification.
function isManualPaymentMethod(value: unknown): value is Exclude<PaymentMethod, "Safepay"> {
  return (MANUAL_PAYMENT_METHODS as readonly unknown[]).includes(value);
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "customer") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError("Request body must be valid JSON");
    }
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      throw new ValidationError("Request body must be a JSON object");
    }
    const input = body as Record<string, unknown>;

    if (!isManualPaymentMethod(input.paymentMethod)) {
      throw new ValidationError(
        input.paymentMethod === "Safepay"
          ? "Safepay payments must go through the Safepay checkout flow"
          : `paymentMethod must be one of: ${MANUAL_PAYMENT_METHODS.join(", ")}`
      );
    }

    const { customerName, phone, address } = parseShippingDetails(input);
    const quantities = parseCartItems(input);
    const { lines, totalAmount } = await buildOrderLines(quantities);
    const orderNumber = await generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        phone,
        address,
        items: lines,
        totalAmount,
        paymentMethod: input.paymentMethod,
        customerId: session.user.id,
        statusHistory: { create: { status: "New" } },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Could not create order" },
      { status: 500 }
    );
  }
}
