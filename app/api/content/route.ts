import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const MAX_ITEMS = 200; // generous — there are 26 known keys today
const MAX_VALUE_LENGTH = 20_000; // body paragraphs and image URLs are well under this

type ContentItem = { key: string; value: string };

function isContentItem(value: unknown): value is ContentItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).key === "string" &&
    (value as Record<string, unknown>).key !== "" &&
    typeof (value as Record<string, unknown>).value === "string"
  );
}

// Batch upsert: the admin edits several Site Content fields and saves once.
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const items =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>).items
      : undefined;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { success: false, error: "items must be a non-empty array of { key, value }" },
      { status: 400 }
    );
  }
  if (items.length > MAX_ITEMS) {
    return NextResponse.json(
      { success: false, error: `At most ${MAX_ITEMS} items can be saved at once` },
      { status: 400 }
    );
  }
  if (!items.every(isContentItem)) {
    return NextResponse.json(
      { success: false, error: "Each item needs a non-empty string key and a string value" },
      { status: 400 }
    );
  }

  const contentItems = items as ContentItem[];
  const tooLong = contentItems.find((item) => item.value.length > MAX_VALUE_LENGTH);
  if (tooLong) {
    return NextResponse.json(
      {
        success: false,
        error: `"${tooLong.key}" is too long (max ${MAX_VALUE_LENGTH} characters)`,
      },
      { status: 400 }
    );
  }

  // Two items with the same key would race inside one transaction.
  const keys = contentItems.map((item) => item.key);
  if (new Set(keys).size !== keys.length) {
    return NextResponse.json(
      { success: false, error: "Duplicate key in the same save" },
      { status: 400 }
    );
  }

  try {
    await prisma.$transaction(
      contentItems.map((item) =>
        prisma.siteContent.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value },
        })
      )
    );

    return NextResponse.json({ success: true, count: contentItems.length });
  } catch (error) {
    console.error("Update site content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save content" },
      { status: 500 }
    );
  }
}
