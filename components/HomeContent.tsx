"use client";

import Link from "next/link";
import type { Product } from "../data/products";
import Button from "./Button";
import ExclusiveCarousel, { type ExclusivePiece } from "./ExclusiveCarousel";
import Footer from "./Footer";
import ProductsList from "./ProductsList";
import TextLink from "./TextLink";

// The copy this page shows, sourced from SiteContent by app/page.tsx (a
// Server Component) since this component is a Client Component and can't
// query Prisma itself. home.hero.background_image and home.story.image are
// intentionally not part of this — the hero and story image stay as they
// were.
export type HomeCopy = {
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  heroCtaText: string;
  storyEyebrow: string;
  storyHeading: string;
  storyBody: string;
  storyLinkText: string;
  jewelleryTitle: string;
  jewelleryDescription: string;
  resinArtTitle: string;
  resinArtDescription: string;
};

export default function HomeContent({
  featuredProducts,
  exclusiveProducts,
  content,
}: {
  featuredProducts: Product[];
  exclusiveProducts: ExclusivePiece[];
  content: HomeCopy;
}) {
  return (
    <main className="min-h-screen bg-white">
      <section className="flex flex-col items-center justify-center text-center px-6 py-24">
        <p className="text-xs tracking-[0.2em] text-gray-400 mb-6">
          {content.heroEyebrow}
        </p>
        {/* The original heading had a two-tone accent (two words in gold)
            hardcoded via <span>s. A single SiteContent string can't carry
            that per-word styling, so this renders as one plain-colour
            heading now — see the accompanying note on this change. */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#1D1D1F] leading-tight">
          {content.heroHeading}
        </h1>
        <p className="mt-6 text-gray-500 max-w-md">
          {content.heroSubheading}
        </p>

        <div className="mt-10 flex gap-4">
          <Link href="/products"><Button variant="primary">{content.heroCtaText}</Button></Link>
        </div>
      </section>

      <section className="bg-[#FBF8F2] px-6 py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="mt-6 text-base md:text-s text-gray-500 leading-relaxed">
              {content.storyEyebrow}
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-[#1D1D1F] leading-snug">
              {content.storyHeading}
            </h2>
            <p className="mt-6 text-base md:text-lg text-gray-500 leading-relaxed">
              {content.storyBody}
            </p>
            <Link href="/about"><TextLink>{content.storyLinkText}</TextLink></Link>
          </div>
          <div className="h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300 text-sm">
            LIFESTYLE — HANDS AT WORK
          </div>
        </div>
      </section>

      {/* No exclusive products marked in the admin: skip the whole section. */}
      {exclusiveProducts.length > 0 && (
        <ExclusiveCarousel exclusiveProducts={exclusiveProducts} />
      )}

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

      <section className="px-6 py-24 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative h-80 rounded-2xl bg-gray-100 overflow-hidden flex items-end p-8 cursor-pointer group">
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm pointer-events-none">
              CATEGORY — JEWELLERY
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[#1D1D1F]">{content.jewelleryTitle}</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                {content.jewelleryDescription}
              </p>
              <Link href="/jewellery" className="inline-block mt-4">
                <TextLink>Explore jewellery →</TextLink>
              </Link>
            </div>
          </div>

          <div className="relative h-80 rounded-2xl bg-gray-100 overflow-hidden flex items-end p-8 cursor-pointer group">
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-gray-300 text-sm">
              CATEGORY — RESIN ART
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-[#1D1D1F]">{content.resinArtTitle}</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                {content.resinArtDescription}
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