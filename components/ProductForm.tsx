"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductFormData = {
  name: string;
  slug: string;
  price: string;
  category: string;
  availability: string;
  description: string;
  featured: boolean;
};

export default function ProductForm({
  mode,
  productId,
  initialData,
}: {
  mode: "create" | "edit";
  productId?: string;
  initialData?: ProductFormData;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProductFormData>(
    initialData ?? {
      name: "",
      slug: "",
      price: "",
      category: "",
      availability: "",
      description: "",
      featured: false,
    }
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url =
        mode === "create" ? "/api/products" : `/api/products/${productId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
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
        <label className="block text-sm text-gray-600 mb-1">Slug</label>
        <input
          name="slug"
          value={form.slug}
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
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          placeholder="jewellery or resin-art"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Availability
        </label>
        <input
          name="availability"
          value={form.availability}
          onChange={handleChange}
          required
          placeholder="In Stock or Made to Order"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
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

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          name="featured"
          checked={form.featured}
          onChange={handleChange}
        />
        Featured on homepage
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 text-white px-4 py-2 rounded-full text-sm disabled:opacity-50 cursor-pointer"
        style={{ background: "linear-gradient(90deg, #B8933E, #E0B0A5)" }}
      >
        {loading ? "Saving..." : mode === "create" ? "Create Product" : "Save Changes"}
      </button>
    </form>
  );
}