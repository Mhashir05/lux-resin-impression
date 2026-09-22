import SiteContentEditor from "@/components/SiteContentEditor";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const rows = await prisma.siteContent.findMany();
  const initialContent = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return <SiteContentEditor initialContent={initialContent} />;
}
