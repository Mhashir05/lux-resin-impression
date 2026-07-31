import { notFound } from "next/navigation";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import ProductDetail from "../../../components/ProductDetail";
import { prisma } from "../../../lib/prisma";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="px-6 pt-16 pb-24 max-w-6xl mx-auto">
        <ProductDetail product={product} />
      </section>
      <Footer />
    </main>
  );
}