import { auth } from "@/lib/auth";
import { AVAILABILITY, CATEGORIES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
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

  try {
    const body = await request.json();
    const { name, slug, price, category, availability, description, featured } = body;

    // PATCH is a partial update: only check the fields that were sent.
    if (
      category !== undefined &&
      !(CATEGORIES as readonly unknown[]).includes(category)
    ) {
      return NextResponse.json(
        { success: false, error: `category must be one of: ${CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }
    if (
      availability !== undefined &&
      !(AVAILABILITY as readonly unknown[]).includes(availability)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `availability must be one of: ${AVAILABILITY.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        price,
        category,
        availability,
        description,
        featured,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}