// Seeds SiteContent with the copy that is currently hardcoded in
// components/HomeContent.tsx, app/about/page.tsx and app/policies/page.tsx.
// The pages themselves are NOT wired to read this table yet — that's a
// separate follow-up. This just gives the admin editor real starting values.
//
// Run manually: npx tsx prisma/seed-content.ts
// Safe to re-run: every row is an upsert, keyed on `key`.
import "dotenv/config";
import { prisma } from "../lib/prisma";

const content: Record<string, string> = {
  // Home — hero
  "home.hero.eyebrow": "Every Piece , Handcrafted to Perfection",
  "home.hero.heading": "Designed to Endure , Admired forever",
  "home.hero.subheading": "Lux jewellery and Resin art.",
  "home.hero.cta_text": "Shop the collection",
  // No hero background image exists in the current page (it's plain white);
  // seeded with a placeholder label in the same style as the other image
  // placeholders below, for the admin to replace.
  "home.hero.background_image": "HERO — BACKGROUND",

  // Home — story teaser
  "home.story.eyebrow": "OUR STORY",
  "home.story.heading": "Crafted with Passion, Worn with Pride.",
  "home.story.body":
    "Crafted beyond seasons. Designed for a lifetime. Every piece is handcrafted with precision to preserve its beauty for years to come.",
  "home.story.link_text": "Read our story →",
  "home.story.image": "LIFESTYLE — HANDS AT WORK",

  // Home — category doors
  "home.category_jewellery.title": "Jewellery",
  "home.category_jewellery.description":
    "Earrings, pendants, bangles and rings set with pressed flowers and gold leaf.",
  "home.category_resin_art.title": "Resin Art",
  "home.category_resin_art.description":
    "Trays, coasters, wall pieces and keepsakes cast to order for your home.",

  // About — hero
  "about.hero.eyebrow": "OUR STORY",
  "about.hero.heading": "A small studio in Karachi, and a lot of patience.",
  "about.hero.body":
    "Lux Resin Impression began at a kitchen table with one silicone mould and a handful of dried flowers. Everything you see here is still made the same way — by hand, one piece at a time.",
  "about.hero.image": "LIFESTYLE — THE STUDIO TABLE",

  // About — maker's note
  "about.maker_note.eyebrow": "A NOTE FROM THE MAKER",
  "about.maker_note.heading": "Every piece takes three days to be sure of.",
  "about.maker_note.body":
    "I started pouring resin because I wanted to keep the flowers from my sister's wedding. That first pendant was cloudy and lopsided, and I made forty more before one felt right. I still mix every batch myself, sand every edge by hand, and wait the full cure — no shortcuts, even when an order is urgent.",
  "about.maker_note.image": "PORTRAIT — THE MAKER",

  // Policies — one editable body per section; headings stay fixed in code.
  "policies.terms.body": "Terms content yahan aayega.",
  "policies.privacy.body": "Privacy content yahan aayega.",
  "policies.shipping.body": "Shipping content yahan aayega.",
  "policies.refund.body": "Refund content yahan aayega.",
};

async function main() {
  const entries = Object.entries(content);
  for (const [key, value] of entries) {
    await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  console.log(`Seeded ${entries.length} SiteContent rows.`);
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});
