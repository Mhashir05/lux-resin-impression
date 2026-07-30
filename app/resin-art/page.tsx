import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import { products } from "../../data/products";
import { ShoppingBag } from "lucide-react";

export default function ResinArtPage() {
  const resinArt = products.filter((p) => p.category === "Resin Art");

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="px-6 pt-20 pb-10 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F]">
          <span className="text-[#B8933E]">Resin Art</span> Collection
        </h1>
        <p className="mt-3 text-gray-500 text-sm">
          Trays, coasters, wall pieces and keepsakes — cast to order for your home.
        </p>
      </section>
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {resinArt.map((product) => (
            <div key={product.slug} className="border border-gray-100 rounded-2xl p-4 transition-shadow duration-300 hover:shadow-md">
              <Link href={`/products/${product.slug}`}>
                <div className="aspect-square bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-300 text-xs cursor-pointer">
                  {product.images[0]}
                </div>
              </Link>
              <Link href={`/products/${product.slug}`}>
                <h3 className="text-sm text-[#1D1D1F] cursor-pointer hover:text-[#B8933E] transition-colors">
                  {product.name}
                </h3>
              </Link>
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
      <Footer />
    </main>
  );
}