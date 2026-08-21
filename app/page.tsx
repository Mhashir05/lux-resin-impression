import HomeContent from "../components/HomeContent";
import { prisma } from "../lib/prisma";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });

  return <HomeContent featuredProducts={featuredProducts} />;
}