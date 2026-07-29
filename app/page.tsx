import { ShoppingBag } from "lucide-react";
import Button from "../components/Button";
import TextLink from "../components/TextLink";
import Footer from "../components/Footer";
import ExclusiveCarousel from "../components/ExclusiveCarousel";
const featuredProducts = [
  { name: "Pressed Flower Pendant", price: "2,750", availability: "Crafted to Order", image: "PENDANT" },
  { name: "Amber Drop Earrings", price: "1,800", availability: "In Stock", image: "EARRINGS" },
  { name: "Ocean Resin Ring", price: "950", availability: "Crafted to Order", image: "RING" },
];
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div className="text-lg tracking-wide text-[#1D1D1F]">
          Lux <span className="text-[#B8933E]">Resin</span> Impression
        </div>
        <div><button className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#B8933E] hover:text-white hover:border-[#B8933E] cursor-pointer">
          <ShoppingBag size={16} />
          Cart (0)
        </button></div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-xs tracking-[0.2em] text-gray-400 mb-6">
          Every Piece , Handcrafted to Perfection
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#1D1D1F] leading-tight">
          Designed to <span className="text-[#B8933E]">Endure.</span> Admired <span className="text-[#B8933E]">forever</span>.
        </h1>
        <p className="mt-6 text-gray-500 max-w-md">
          Lux jewellery and Resin art.
        </p>

        <div className="mt-10 flex gap-4">
          <Button variant="primary">Shop the collection</Button>
          
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
            <button className="mt-8 text-sm text-[#B8933E] border-b border-transparent transition-all duration-300 hover:text-[#9C6B4A] hover:border-[#9C6B4A] cursor-pointer">
              Read our story →
            </button>
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
          <TextLink>View all →</TextLink>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.name} className="border border-gray-100 rounded-2xl p-4 transition-shadow duration-300 hover:shadow-md">
              <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-300 text-xs">
                {product.image}
              </div>
              <h3 className="text-sm text-[#1D1D1F]">{product.name}</h3>
              <p className="text-sm text-gray-500 mt-1">PKR {product.price}</p>
              <span className="inline-block mt-2 mb-4 text-xs text-[#B8933E] border border-[#B8933E]/30 rounded-full px-3 py-1">
                {product.availability}
              </span>
              <button className="w-full flex items-center justify-center gap-2 bg-[#1D1D1F] text-white text-sm py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E]">
                <ShoppingBag size={15} />
                Add to cart
              </button>
            </div>
          ))}
        </div>
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
              <span className="inline-block mt-4 text-sm text-[#B8933E] transition-all duration-300 group-hover:text-[#9C6B4A]">
              <TextLink>Explore jewellery →</TextLink>
              </span>
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
              <span className="inline-block mt-4 text-sm text-[#B8933E] transition-all duration-300 group-hover:text-[#9C6B4A]">
              <TextLink>Explore resin art →</TextLink>
              </span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}