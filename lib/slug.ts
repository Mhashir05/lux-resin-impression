// URL-safe slug from a product name: lowercase a-z, 0-9 and single hyphens.
// "Rose & Gold Ring" -> "rose-gold-ring". Returns "" if nothing usable is left
// (e.g. a name made only of symbols), so callers must check for that.
export function generateSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // drop accents: "Café" -> "Cafe"
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}
