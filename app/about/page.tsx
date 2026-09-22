import type { Metadata } from "next";
import Footer from "../../components/Footer";
import { isLikelyUrl } from "../../lib/is-likely-url";
import { getSiteContent } from "../../lib/site-content";

export const metadata: Metadata = {
  title: "About",
};

// The copy that was hardcoded here before this page started reading from
// SiteContent. Used only if a key is unexpectedly missing from the
// database, so the page never crashes or goes blank for it.
const FALLBACKS = {
  "about.hero.eyebrow": "OUR STORY",
  "about.hero.heading": "A small studio in Karachi, and a lot of patience.",
  "about.hero.body":
    "Lux Resin Impression began at a kitchen table with one silicone mould and a handful of dried flowers. Everything you see here is still made the same way — by hand, one piece at a time.",
  "about.hero.image": "LIFESTYLE — THE STUDIO TABLE",
  "about.maker_note.eyebrow": "A NOTE FROM THE MAKER",
  "about.maker_note.heading": "Every piece takes three days to be sure of.",
  "about.maker_note.body":
    "I started pouring resin because I wanted to keep the flowers from my sister's wedding. That first pendant was cloudy and lopsided, and I made forty more before one felt right. I still mix every batch myself, sand every edge by hand, and wait the full cure — no shortcuts, even when an order is urgent.",
  "about.maker_note.image": "PORTRAIT — THE MAKER",
} as const;

export default async function AboutPage() {
  const siteContent = await getSiteContent();
  const get = (key: keyof typeof FALLBACKS) => siteContent[key] || FALLBACKS[key];

  const heroImage = get("about.hero.image");
  const makerImage = get("about.maker_note.image");

  return (
    <main className="min-h-screen bg-white">
      {/* Hero / Story intro */}
      <section className="px-6 pt-32 pb-20 max-w-4xl mx-auto text-center">
        <p className="text-xs tracking-[0.25em] text-[#B8933E] mb-4">
          {get("about.hero.eyebrow")}
        </p>
        {/* The original heading had one word ("patience") hardcoded gold via
            a <span>. A single SiteContent string can't carry that per-word
            styling, so this renders as one plain-colour heading now. */}
        <h1 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] leading-tight">
          {get("about.hero.heading")}
        </h1>
        <p className="mt-6 text-gray-500 leading-relaxed max-w-2xl mx-auto">
          {get("about.hero.body")}
        </p>
      </section>

      {/* Lifestyle image */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="h-96 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 text-sm overflow-hidden">
          {isLikelyUrl(heroImage) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt="The studio"
              className="w-full h-full object-cover"
            />
          ) : (
            heroImage
          )}
        </div>
      </section>

      {/* Maker's note */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 text-sm overflow-hidden">
            {isLikelyUrl(makerImage) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={makerImage}
                alt="The maker"
                className="w-full h-full object-cover"
              />
            ) : (
              makerImage
            )}
          </div>
          <div>
            <p className="text-xs tracking-[0.2em] text-[#B8933E] mb-3">
              {get("about.maker_note.eyebrow")}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] leading-snug">
              {get("about.maker_note.heading")}
            </h2>
            <p className="mt-5 text-gray-500 leading-relaxed">
              {get("about.maker_note.body")}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
