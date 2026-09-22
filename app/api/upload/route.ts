import { auth } from "@/lib/auth";
import { uploadProductImage } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB per image
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Request body must be multipart/form-data" },
      { status: 400 }
    );
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "At least one image file is required (field name: images)" },
      { status: 400 }
    );
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `"${file.name}" is not a JPG, PNG or WEBP image` },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `"${file.name}" is larger than 5MB` },
        { status: 400 }
      );
    }
  }

  try {
    const urls = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return uploadProductImage(buffer);
      })
    );

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload one or more images" },
      { status: 500 }
    );
  }
}
