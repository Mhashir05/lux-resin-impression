import Link from "next/link";
import Button from "../components/Button";
import ExclusiveCarousel from "../components/ExclusiveCarousel";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductsList from "../components/ProductsList";
import TextLink from "../components/TextLink";
import { prisma } from "../lib/prisma";

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-xs tracking-[0.2em] text-gray-400 mb-6">
          Every Piece , Handcrafted to Perfection
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#1D1D1F] leading-tight">
          Designed to <span className="text-[#B8933E]">Endure ,</span> Admired <span className="text-[#B8933E]">forever</span>
        </h1>
        <p className="mt-6 text-gray-500 max-w-md">
          Lux jewellery and Resin art.
        </p>

        <div className="mt-10 flex gap-4">
          <Link href="/products"><Button variant="primary">Shop the collection</Button></Link>
          
        </div>
      </section>
      {/* Story Section */}
      <section className="bg-[#FBF8F2] px-6 py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="mt-6 text-base md:text-s text-gray-500 leading-relaxed">
              OUR STORY
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-[#1D1D1F] leading-snug">
              Crafted with Passion, Worn with Pride.
            </h2>
            <p className="mt-6 text-base md:text-lg text-gray-500 leading-relaxed">
              Crafted beyond seasons. Designed for a lifetime.
Every piece is handcrafted with precision to preserve its beauty for years to come.
            </p>
            <Link href="/about"><TextLink>Read our story →</TextLink></Link>
          </div>
          <div className="h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 text-sm">
            LIFESTYLE — HANDS AT WORK
          </div>
        </div>
      </section>
      <ExclusiveCarousel />
      {/* Featured Products */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.25em] text-[#B8933E] mb-3">THE</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F]">
              Featured <span className="text-[#B8933E]">Collection</span>
            </h2>
            <div className="w-16 h-[2px] bg-[#B8933E] mt-3"></div>
          </div>
          <TextLink href="/products">View Catalog →</TextLink>
        </div>

        <ProductsList products={featuredProducts} />
      </section>
      {/* Category Doors */}
      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Jewellery */}
          <div className="relative h-80 rounded-2xl bg-gray-100 overflow-hidden flex items-end p-8 cursor-pointer group">
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm pointer-events-none">
              CATEGORY — JEWELLERY
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[#1D1D1F]">Jewellery</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Earrings, pendants, bangles and rings set with pressed flowers and gold leaf.
              </p>
              <Link href="/jewellery" className="inline-block mt-4">
                <TextLink>Explore jewellery →</TextLink>
              </Link>
            </div>
          </div>

          {/* Resin Art */}
          <div className="relative h-80 rounded-2xl bg-gray-100 overflow-hidden flex items-end p-8 cursor-pointer group">
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-300 text-sm">
              CATEGORY — RESIN ART
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[#1D1D1F]">Resin Art</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Trays, coasters, wall pieces and keepsakes cast to order for your home.
              </p>
              <Link href="/resin-art" className="inline-block mt-4">
                <TextLink>Explore resin art →</TextLink>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}