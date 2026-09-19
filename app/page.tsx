import HomeContent from "../components/HomeContent";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });

  return <HomeContent featuredProducts={featuredProducts} />;
}