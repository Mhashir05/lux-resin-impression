import type { Metadata } from "next";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export const metadata: Metadata = {
  title: "Policies",
};

const sections = [
  { id: "terms", title: "Terms of Service", body: "Terms content yahan aayega." },
  { id: "privacy", title: "Privacy Policy", body: "Privacy content yahan aayega." },
  { id: "shipping", title: "Shipping Policy", body: "Shipping content yahan aayega." },
  { id: "refund", title: "Refund Policy", body: "Refund content yahan aayega." },
];

export default function PoliciesPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero intro */}
      <section className="px-6 pt-32 pb-16 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] leading-tight">
          Our <span className="text-[#B8933E]">policies</span>
        </h1>
        <p className="mt-6 text-gray-500 leading-relaxed max-w-2xl mx-auto">
          Everything you need to know about ordering, delivery, and returns <br />Clearly
          laid out, no fine print.
        </p>
      </section>

      {/* Policy sections */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        {sections.map((s) => (
          <div key={s.id} id={s.id} className="mb-16 scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] leading-snug mb-4">
              {s.title}
            </h2>
            <p className="text-gray-500 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
}