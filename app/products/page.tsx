import Footer from "../../components/Footer";
import ProductsList from "../../components/ProductsList";
import { prisma } from "../../lib/prisma";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 pt-20 pb-10 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F]">
          The <span className="text-[#B8933E]">Collection</span>
        </h1>
        <p className="mt-3 text-gray-500 text-sm">
          Every piece cast, sanded and finished by hand.
        </p>
      </section>
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <ProductsList products={products} />
      </section>
      <Footer />
    </main>
  );
}