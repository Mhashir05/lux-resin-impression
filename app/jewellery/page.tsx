import { ShoppingBag } from "lucide-react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const products = [
  { name: "Amber Drop Earrings", price: "1,800", availability: "In Stock", image: "EARRINGS" },
  { name: "Pressed Flower Pendant", price: "2,750", availability: "Crafted to Order", image: "PENDANT" },
  { name: "Ivory Bangle", price: "3,200", availability: "In Stock", image: "BANGLE" },
  { name: "Gold Leaf Studs", price: "1,200", availability: "In Stock", image: "STUDS" },
];

export default function JewelleryPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="px-6 pt-20 pb-10 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F]">
          <span className="text-[#B8933E]">Jewellery</span> Collection
        </h1>
        <p className="mt-3 text-gray-500 text-sm">
          Earrings, pendants, bangles and rings — handcrafted with pressed flowers.
        </p>
      </section>
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
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
      <Footer />
    </main>
  );
}