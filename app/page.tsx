import HomeContent from "../components/HomeContent";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featuredProducts, exclusiveProducts] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isExclusive: true },
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        name: true,
        category: true,
        description: true,
        price: true,
        images: true,
      },
    }),
  ]);

  return (
    <HomeContent
      featuredProducts={featuredProducts}
      exclusiveProducts={exclusiveProducts}
    />
  );
}
