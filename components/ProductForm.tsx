"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AVAILABILITY, CATEGORIES } from "../lib/constants";
import { isLikelyUrl } from "../lib/is-likely-url";

type ProductFormData = {
  name: string;
  price: string;
  category: string;
  availability: string;
  description: string;
  featured: boolean;
  isExclusive: boolean;
};

const MAX_IMAGES = 6;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

// One image in the form, in display order. `file` is set for a newly picked
// image that hasn't been uploaded yet; `url` is either its local object-URL
// preview or, for an image the product already has, its saved Cloudinary URL.
type ImageSlot = {
  id: string;
  url: string;
  file?: File;
};

// Options for a <select>. If the stored value isn't one of the current options
// (e.g. a product created before these lists existed), keep it selectable so
// editing the product doesn't silently change it.
function buildOptions(options: readonly string[], current: string) {
  const list = options.map((value) => ({ value, label: value }));
  if (current && !options.includes(current)) {
    list.unshift({ value: current, label: `${current} (legacy value)` });
  }
  return list;
}

export default function ProductForm({
  mode,
  productId,
  initialData,
  initialImages,
}: {
  mode: "create" | "edit";
  productId?: string;
  initialData?: ProductFormData;
  initialImages?: string[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState("");

  const [form, setForm] = useState<ProductFormData>(
    initialData ?? {
      name: "",
      price: "",
      category: "",
      availability: "",
      description: "",
      featured: false,
      isExclusive: false,
    }
  );

  const [images, setImages] = useState<ImageSlot[]>(() =>
    (initialImages ?? []).map((url) => ({ id: crypto.randomUUID(), url }))
  );
  // Some existing products predate real image uploads and store a label
  // string instead of a URL (e.g. "TRAY — TOP"); show that text instead of a
  // broken image icon.
  const [brokenIds, setBrokenIds] = useState<Set<string>>(new Set());

  // Local object-URL previews are only valid for this page's lifetime.
  useEffect(() => {
    return () => {
      for (const image of images) {
        if (image.file) URL.revokeObjectURL(image.url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow picking the same file again later
    if (picked.length === 0) return;

    setImageError("");

    const invalid = picked.find((f) => !ALLOWED_TYPES.has(f.type));
    if (invalid) {
      setImageError(`"${invalid.name}" isn't a JPG, PNG or WEBP image`);
      return;
    }

    setImages((prev) => {
      const room = MAX_IMAGES - prev.length;
      if (room <= 0) {
        setImageError(`You can have at most ${MAX_IMAGES} images`);
        return prev;
      }
      const accepted = picked.slice(0, room);
      if (picked.length > accepted.length) {
        setImageError(`Only added ${accepted.length} — a product can have at most ${MAX_IMAGES} images`);
      }
      const added: ImageSlot[] = accepted.map((file) => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        file,
      }));
      return [...prev, ...added];
    });
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target?.file) URL.revokeObjectURL(target.url);
      return prev.filter((img) => img.id !== id);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Upload any newly picked images first. If this fails, stop here —
      // the product is not created or updated with a broken images array.
      const toUpload = images.filter((img) => img.file);
      let uploadedUrls: string[] = [];
      if (toUpload.length > 0) {
        setUploading(true);
        const uploadBody = new FormData();
        for (const img of toUpload) uploadBody.append("images", img.file as File);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadBody,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Failed to upload images");
        }
        uploadedUrls = uploadData.urls as string[];
        setUploading(false);
      }

      // Rebuild the final image list in the order shown on the page: kept
      // existing URLs stay put, new slots get their uploaded URL.
      let nextUploaded = 0;
      const finalImages = images.map((img) =>
        img.file ? uploadedUrls[nextUploaded++] : img.url
      );

      const url =
        mode === "create" ? "/api/products" : `/api/products/${productId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images: finalImages }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setUploading(false);
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto py-8 flex flex-col gap-4"
    >
      <h1 className="text-2xl text-[#1D1D1F] mb-2">
        {mode === "create" ? "Add Product" : "Edit Product"}
      </h1>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm text-gray-600 mb-1">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Price (PKR)</label>
        <input
          name="price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="" disabled>
            Select a category
          </option>
          {buildOptions(CATEGORIES, form.category).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Availability
        </label>
        <select
          name="availability"
          value={form.availability}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="" disabled>
            Select availability
          </option>
          {buildOptions(AVAILABILITY, form.availability).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Images ({images.length}/{MAX_IMAGES})
        </label>
        <p className="text-xs text-gray-400 mb-2">
          Up to {MAX_IMAGES} images. The first is used as the main photo.
        </p>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((image, index) => (
              <div key={image.id} className="relative w-20 h-20">
                {brokenIds.has(image.id) || !isLikelyUrl(image.url) ? (
                  <div className="w-20 h-20 rounded-md border border-gray-300 bg-gray-50 flex items-center justify-center text-center text-[9px] text-gray-400 px-1 overflow-hidden">
                    {image.url}
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    onError={() =>
                      setBrokenIds((prev) => new Set(prev).add(image.id))
                    }
                    className="w-20 h-20 object-cover rounded-md border border-gray-300"
                  />
                )}
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-[#1D1D1F]/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-500 text-xs cursor-pointer hover:border-red-400 hover:text-red-500"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {imageError && (
          <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-md mb-2">
            {imageError}
          </p>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesSelected}
          disabled={images.length >= MAX_IMAGES}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:opacity-50"
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
          className="mt-0.5"
        />
        <span>
          Featured on homepage
          <span className="block text-xs text-gray-400">
            Highlights this product on the home page.
          </span>
        </span>
      </label>

      <label className="flex items-start gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          name="isExclusive"
          checked={form.isExclusive}
          onChange={handleChange}
          className="mt-0.5"
        />
        <span>
          Mark as Exclusive
          <span className="block text-xs text-gray-400">
            Adds this product to the Exclusive collection. Separate from Featured.
          </span>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 text-white px-4 py-2 rounded-full text-sm disabled:opacity-50 cursor-pointer"
        style={{ background: "linear-gradient(90deg, #B8933E, #E0B0A5)" }}
      >
        {uploading
          ? "Uploading images..."
          : loading
          ? "Saving..."
          : mode === "create"
          ? "Create Product"
          : "Save Changes"}
      </button>
    </form>
  );
}
