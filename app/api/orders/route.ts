import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const order = await prisma.order.create({
      data: {
        customerName: body.customerName,
        phone: body.phone,
        address: body.address,
        items: body.items,
        totalAmount: body.totalAmount,
        paymentMethod: body.paymentMethod,
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Could not create order" },
      { status: 500 }
    );
  }
}