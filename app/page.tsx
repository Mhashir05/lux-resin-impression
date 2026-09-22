import HomeContent, { type HomeCopy } from "../components/HomeContent";
import { getSiteContent } from "../lib/site-content";
import { prisma } from "../lib/prisma";

export const dynamic = "force-dynamic";

// The copy that was hardcoded in HomeContent.tsx before this page started
// reading from SiteContent. Used only if a key is unexpectedly missing from
// the database, so the page never crashes or goes blank for it.
const FALLBACKS: HomeCopy = {
  heroEyebrow: "Every Piece , Handcrafted to Perfection",
  heroHeading: "Designed to Endure , Admired forever",
  heroSubheading: "Lux jewellery and Resin art.",
  heroCtaText: "Shop the collection",
  storyEyebrow: "OUR STORY",
  storyHeading: "Crafted with Passion, Worn with Pride.",
  storyBody:
    "Crafted beyond seasons. Designed for a lifetime. Every piece is handcrafted with precision to preserve its beauty for years to come.",
  storyLinkText: "Read our story →",
  jewelleryTitle: "Jewellery",
  jewelleryDescription:
    "Earrings, pendants, bangles and rings set with pressed flowers and gold leaf.",
  resinArtTitle: "Resin Art",
  resinArtDescription:
    "Trays, coasters, wall pieces and keepsakes cast to order for your home.",
};

export default async function Home() {
  const [featuredProducts, exclusiveProducts, siteContent] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { isExclusive: true },
      orderBy: { createdAt: "desc" },
      select: {
        slug: true,
        name: true,
        category: true,
        description: true,
        price: true,
        images: true,
      },
    }),
    getSiteContent(),
  ]);

  // home.hero.background_image and home.story.image are intentionally left
  // out — this pass only wires the text fields listed for Home.
  const content: HomeCopy = {
    heroEyebrow: siteContent["home.hero.eyebrow"] || FALLBACKS.heroEyebrow,
    heroHeading: siteContent["home.hero.heading"] || FALLBACKS.heroHeading,
    heroSubheading: siteContent["home.hero.subheading"] || FALLBACKS.heroSubheading,
    heroCtaText: siteContent["home.hero.cta_text"] || FALLBACKS.heroCtaText,
    storyEyebrow: siteContent["home.story.eyebrow"] || FALLBACKS.storyEyebrow,
    storyHeading: siteContent["home.story.heading"] || FALLBACKS.storyHeading,
    storyBody: siteContent["home.story.body"] || FALLBACKS.storyBody,
    storyLinkText: siteContent["home.story.link_text"] || FALLBACKS.storyLinkText,
    jewelleryTitle:
      siteContent["home.category_jewellery.title"] || FALLBACKS.jewelleryTitle,
    jewelleryDescription:
      siteContent["home.category_jewellery.description"] || FALLBACKS.jewelleryDescription,
    resinArtTitle:
      siteContent["home.category_resin_art.title"] || FALLBACKS.resinArtTitle,
    resinArtDescription:
      siteContent["home.category_resin_art.description"] || FALLBACKS.resinArtDescription,
  };

  return (
    <HomeContent
      featuredProducts={featuredProducts}
      exclusiveProducts={exclusiveProducts}
      content={content}
    />
  );
}
