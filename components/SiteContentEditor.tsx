"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FieldType = "text" | "textarea" | "image";
type FieldDef = { key: string; label: string; type: FieldType };
type SectionDef = { title: string; fields: FieldDef[] };
type GroupDef = { title: string; sections: SectionDef[] };

// Mirrors exactly what prisma/seed-content.ts seeds. Add a field here and to
// the seed script together, or the editor will show a blank value for it.
const GROUPS: GroupDef[] = [
  {
    title: "Home",
    sections: [
      {
        title: "Hero",
        fields: [
          { key: "home.hero.eyebrow", label: "Eyebrow", type: "text" },
          { key: "home.hero.heading", label: "Heading", type: "text" },
          { key: "home.hero.subheading", label: "Subheading / tagline", type: "text" },
          { key: "home.hero.cta_text", label: "CTA button text", type: "text" },
          { key: "home.hero.background_image", label: "Background image", type: "image" },
        ],
      },
      {
        title: "Story teaser",
        fields: [
          { key: "home.story.eyebrow", label: "Eyebrow", type: "text" },
          { key: "home.story.heading", label: "Heading", type: "text" },
          { key: "home.story.body", label: "Body paragraph", type: "textarea" },
          { key: "home.story.link_text", label: "Link text", type: "text" },
          { key: "home.story.image", label: "Image", type: "image" },
        ],
      },
      {
        title: "Category doors",
        fields: [
          { key: "home.category_jewellery.title", label: "Jewellery — title", type: "text" },
          {
            key: "home.category_jewellery.description",
            label: "Jewellery — description",
            type: "textarea",
          },
          { key: "home.category_resin_art.title", label: "Resin Art — title", type: "text" },
          {
            key: "home.category_resin_art.description",
            label: "Resin Art — description",
            type: "textarea",
          },
        ],
      },
    ],
  },
  {
    title: "About",
    sections: [
      {
        title: "Hero",
        fields: [
          { key: "about.hero.eyebrow", label: "Eyebrow", type: "text" },
          { key: "about.hero.heading", label: "Heading", type: "text" },
          { key: "about.hero.body", label: "Body paragraph", type: "textarea" },
          { key: "about.hero.image", label: "Image", type: "image" },
        ],
      },
      {
        title: "Maker's note",
        fields: [
          { key: "about.maker_note.eyebrow", label: "Eyebrow", type: "text" },
          { key: "about.maker_note.heading", label: "Heading", type: "text" },
          { key: "about.maker_note.body", label: "Body paragraph", type: "textarea" },
          { key: "about.maker_note.image", label: "Image", type: "image" },
        ],
      },
    ],
  },
  {
    title: "Policies",
    sections: [
      { title: "Terms of Service", fields: [{ key: "policies.terms.body", label: "Body", type: "textarea" }] },
      { title: "Privacy Policy", fields: [{ key: "policies.privacy.body", label: "Body", type: "textarea" }] },
      { title: "Shipping Policy", fields: [{ key: "policies.shipping.body", label: "Body", type: "textarea" }] },
      { title: "Refund Policy", fields: [{ key: "policies.refund.body", label: "Body", type: "textarea" }] },
    ],
  },
];

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

// A saved SiteContent image value can be a real URL, or (until the admin
// replaces it) the placeholder label it was seeded with, e.g. "PORTRAIT —
// THE MAKER". Only treat it as a displayable image if it's shaped like one.
function isLikelyUrl(value: string): boolean {
  return /^(https?:|blob:|data:)/i.test(value);
}

export default function SiteContentEditor({
  initialContent,
}: {
  initialContent: Record<string, string>;
}) {
  const router = useRouter();
  const [fields, setFields] = useState<Record<string, string>>(initialContent);
  // Newly picked image files, keyed by field key, not yet uploaded.
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  // Bumped per field key to force its file input to remount (and so clear)
  // after a remove, so the same file can be picked again afterwards.
  const [fileInputResetKey, setFileInputResetKey] = useState<Record<string, number>>({});

  function setText(key: string, value: string) {
    setSaved(false);
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function pickImage(key: string, file: File | undefined) {
    if (!file) return;
    setSaved(false);
    setError("");
    if (!ALLOWED_TYPES.has(file.type)) {
      setError(`"${file.name}" isn't a JPG, PNG or WEBP image`);
      return;
    }
    setPendingFiles((prev) => ({ ...prev, [key]: file }));
    setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
  }

  function removeImage(key: string) {
    setSaved(false);
    setError("");

    setPendingFiles((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setPreviews((prev) => {
      if (!(key in prev)) return prev;
      URL.revokeObjectURL(prev[key]);
      const next = { ...prev };
      delete next[key];
      return next;
    });
    // A previously saved image: clear it so Save All Changes writes "".
    // (No-op if this field only ever held an unsaved local preview.)
    setFields((prev) => (prev[key] ? { ...prev, [key]: "" } : prev));

    setFileInputResetKey((prev) => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }));
  }

  async function handleSaveAll() {
    setError("");
    setSaved(false);
    setSaving(true);

    try {
      let finalFields = fields;

      const pendingEntries = Object.entries(pendingFiles);
      if (pendingEntries.length > 0) {
        setUploading(true);
        const uploadBody = new FormData();
        for (const [, file] of pendingEntries) uploadBody.append("images", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadBody,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Failed to upload images");
        }
        setUploading(false);

        const urls: string[] = uploadData.urls;
        finalFields = { ...fields };
        pendingEntries.forEach(([key], index) => {
          finalFields[key] = urls[index];
        });
      }

      const items = Object.entries(finalFields).map(([key, value]) => ({ key, value }));

      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save content");
      }

      setFields(finalFields);
      setPendingFiles({});
      setSaved(true);
      router.refresh();
    } catch (err) {
      setUploading(false);
      setError(err instanceof Error ? err.message : "Failed to save content");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-[#1D1D1F]">Site Content</h1>
        <span className="text-sm text-gray-500">
          Home, About and Policies copy — not yet live on the public pages.
        </span>
      </div>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-md">{error}</p>
      )}
      {saved && !error && (
        <p className="text-sm bg-green-50 text-green-700 px-3 py-2 rounded-md">
          Saved.
        </p>
      )}

      {GROUPS.map((group) => (
        <div key={group.title}>
          <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">{group.title}</h2>
          <div className="space-y-4">
            {group.sections.map((section) => (
              <div
                key={section.title}
                className="bg-white border border-gray-200 rounded-xl p-5 space-y-4"
              >
                <h3 className="text-sm font-medium text-[#B8933E]">{section.title}</h3>

                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm text-gray-600 mb-1">
                      {field.label}
                    </label>

                    {field.type === "text" && (
                      <input
                        value={fields[field.key] ?? ""}
                        onChange={(e) => setText(field.key, e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    )}

                    {field.type === "textarea" && (
                      <textarea
                        value={fields[field.key] ?? ""}
                        onChange={(e) => setText(field.key, e.target.value)}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    )}

                    {field.type === "image" && (
                      <div>
                        <div className="relative w-24 h-24 mb-2">
                          {previews[field.key] || isLikelyUrl(fields[field.key] ?? "") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={previews[field.key] ?? fields[field.key]}
                              alt={field.label}
                              className="w-24 h-24 object-cover rounded-md border border-gray-300"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-md border border-gray-300 bg-gray-50 flex items-center justify-center text-center text-[9px] text-gray-400 px-1 overflow-hidden">
                              {fields[field.key]}
                            </div>
                          )}
                          {(previews[field.key] || fields[field.key]) && (
                            <button
                              type="button"
                              onClick={() => removeImage(field.key)}
                              aria-label={`Remove ${group.title} — ${section.title} image`}
                              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-500 text-xs cursor-pointer hover:border-red-400 hover:text-red-500"
                            >
                              &times;
                            </button>
                          )}
                        </div>
                        <input
                          key={fileInputResetKey[field.key] ?? 0}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => pickImage(field.key, e.target.files?.[0])}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleSaveAll}
        disabled={saving}
        className="text-white px-5 py-2.5 rounded-full text-sm disabled:opacity-50 cursor-pointer"
        style={{ background: "linear-gradient(90deg, #B8933E, #E0B0A5)" }}
      >
        {uploading ? "Uploading images..." : saving ? "Saving..." : "Save All Changes"}
      </button>
    </div>
  );
}
