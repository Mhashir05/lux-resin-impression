import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ProductsList from "../../components/ProductsList";
import { prisma } from "../../lib/prisma";

export default async function JewelleryPage() {
  const jewellery = await prisma.product.findMany({
    where: { category: "Jewellery" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="px-6 pt-20 pb-10 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F]">
          <span className="text-[#B8933E]">Jewellery</span> Collection
        </h1>
        <p className="mt-3 text-gray-500 text-sm">
          Earrings, pendants, bangles and studs — handcrafted with pressed flowers.
        </p>
      </section>
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <ProductsList products={jewellery} />
      </section>
      <Footer />
    </main>
  );
}