import { prisma } from "./prisma";

// Fetches every SiteContent row and returns it as a plain key -> value map,
// for a Server Component page to read from and fall back around.
export async function getSiteContent(): Promise<Record<string, string>> {
  const rows = await prisma.siteContent.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}
