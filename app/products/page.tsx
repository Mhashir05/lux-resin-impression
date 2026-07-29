import { ShoppingBag } from "lucide-react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const allProducts = [
  { name: "Amber Drop Earrings", price: "1,800", availability: "In Stock", image: "EARRINGS" },
  { name: "Pressed Flower Pendant", price: "2,750", availability: "Crafted to Order", image: "PENDANT" },
  { name: "Ivory Bangle", price: "3,200", availability: "In Stock", image: "BANGLE" },
  { name: "Gold Leaf Studs", price: "1,200", availability: "In Stock", image: "STUDS" },
  { name: "Ocean Resin Tray", price: "3,500", availability: "Crafted to Order", image: "TRAY" },
  { name: "Marble Coaster Set", price: "2,400", availability: "In Stock", image: "COASTERS" },
  { name: "Geode Wall Piece", price: "12,000", availability: "Crafted to Order", image: "WALL ART" },
  { name: "Floral Keepsake Frame", price: "6,800", availability: "Crafted to Order", image: "FRAME" },
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Heading */}
      <section className="px-6 pt-20 pb-10 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F]">
          The <span className="text-[#B8933E]">Collection</span>
        </h1>
        <p className="mt-3 text-gray-500 text-sm">
          Every piece cast, sanded and finished by hand.
        </p>
      </section>

      {/* All products grid */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {allProducts.map((product) => (
            <div
              key={product.name}
              className="border border-gray-100 rounded-2xl p-4 transition-shadow duration-300 hover:shadow-md"
            >
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