import { auth } from "@/lib/auth";
import { AVAILABILITY, CATEGORIES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/slug";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    // Any client-sent slug is ignored; it is generated from the name below.
    const { name, price, category, availability, description, featured, isExclusive, images } = body;

    if (!name || !price || !category || !availability || !description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!(CATEGORIES as readonly unknown[]).includes(category)) {
      return NextResponse.json(
        { error: `category must be one of: ${CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }
    if (!(AVAILABILITY as readonly unknown[]).includes(availability)) {
      return NextResponse.json(
        { error: `availability must be one of: ${AVAILABILITY.join(", ")}` },
        { status: 400 }
      );
    }

    if (isExclusive !== undefined && typeof isExclusive !== "boolean") {
      return NextResponse.json(
        { error: "isExclusive must be true or false" },
        { status: 400 }
      );
    }
    if (
      images !== undefined &&
      (!Array.isArray(images) || !images.every((url) => typeof url === "string"))
    ) {
      return NextResponse.json(
        { error: "images must be an array of URLs" },
        { status: 400 }
      );
    }
    if (typeof name !== "string") {
      return NextResponse.json(
        { error: "name must be a string" },
        { status: 400 }
      );
    }
    const baseSlug = generateSlug(name);
    if (!baseSlug) {
      return NextResponse.json(
        { error: "name must contain at least one letter or number" },
        { status: 400 }
      );
    }

    // "ring", then "ring-2", "ring-3", ... until the slug is free.
    const taken = new Set(
      (
        await prisma.product.findMany({
          where: { slug: { startsWith: baseSlug } },
          select: { slug: true },
        })
      ).map((p) => p.slug)
    );
    let slug = baseSlug;
    for (let n = 2; taken.has(slug); n++) {
      slug = `${baseSlug}-${n}`;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        price,
        category,
        availability,
        description,
        featured: featured ?? false,
        isExclusive: isExclusive ?? false,
        images: images ?? [],
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}