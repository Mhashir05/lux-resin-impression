import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Footer from "../../components/Footer";

export default function OrderConfirmedPage() {
  return (
    <main className="min-h-screen bg-white">

      <section className="px-6 py-32 max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-[#B8933E]" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-4">
          Thank you for your <span className="text-[#B8933E]">order</span>
        </h1>

        <p className="text-gray-500 leading-relaxed mb-2">
          We&apos;ve received your order and will confirm it with you on WhatsApp shortly.
        </p>
        <p className="text-gray-500 leading-relaxed mb-10">
          Every piece is handcrafted with care — we&apos;ll keep you updated at every step.
        </p>

        <Link
          href="/products"
          className="inline-block bg-[#1D1D1F] text-white text-sm px-8 py-3 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#B8933E]"
        >
          Continue shopping
        </Link>
      </section>

      <Footer />
    </main>
  );
}