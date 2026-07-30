import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      {/* Hero / Story intro */}
      <section className="px-6 pt-32 pb-20 max-w-4xl mx-auto text-center">
        <p className="text-xs tracking-[0.25em] text-[#B8933E] mb-4">OUR STORY</p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] leading-tight">
          A small studio in Karachi, and a lot of{" "}
          <span className="text-[#B8933E]">patience</span>.
        </h1>
        <p className="mt-6 text-gray-500 leading-relaxed max-w-2xl mx-auto">
          Lux Resin Impression began at a kitchen table with one silicone mould and a
          handful of dried flowers. Everything you see here is still made the same way
          — by hand, one piece at a time.
        </p>
      </section>

      {/* Lifestyle image */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="h-96 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 text-sm">
          LIFESTYLE — THE STUDIO TABLE
        </div>
      </section>

      {/* Maker's note */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 text-sm">
            PORTRAIT — THE MAKER
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-[#B8933E] mb-3">
              A NOTE FROM THE MAKER
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] leading-snug">
              Every piece takes three days to be sure of.
            </h2>
            <p className="mt-5 text-gray-500 leading-relaxed">
              I started pouring resin because I wanted to keep the flowers from my
              sister's wedding. That first pendant was cloudy and lopsided, and I made
              forty more before one felt right. I still mix every batch myself, sand
              every edge by hand, and wait the full cure — no shortcuts, even when an
              order is urgent.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}