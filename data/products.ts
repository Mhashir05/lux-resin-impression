export type Product = {
  slug: string;
  name: string;
  price: string;
  availability: string;
  category: string;
  description: string;
  images: string[];
};

export const products: Product[] = [
  {
    slug: "amber-drop-earrings",
    name: "Amber Drop Earrings",
    price: "1,800",
    availability: "In Stock",
    category: "Jewellery",
    description: "Warm amber-toned resin drops on gold-plated hooks. Light to wear, and each drop catches the light a little differently.",
    images: ["EARRINGS — FRONT", "EARRINGS — SIDE", "EARRINGS — DETAIL", "EARRINGS — WORN"],
  },
  {
    slug: "pressed-flower-pendant",
    name: "Pressed Flower Pendant",
    price: "2,750",
    availability: "Crafted to Order",
    category: "Jewellery",
    description: "A real pressed bloom suspended in clear resin, edged with a whisper of gold leaf. Each pendant is cast individually, so no two flowers sit the same way.",
    images: ["PENDANT — FRONT", "PENDANT — SIDE", "PENDANT — DETAIL", "PENDANT — WORN"],
  },
  {
    slug: "ivory-bangle",
    name: "Ivory Bangle",
    price: "3,200",
    availability: "In Stock",
    category: "Jewellery",
    description: "A smooth ivory-white resin bangle with a soft pearl finish. Simple, timeless, and easy to stack.",
    images: ["BANGLE — FRONT", "BANGLE — SIDE", "BANGLE — DETAIL", "BANGLE — WORN"],
  },
  {
    slug: "gold-leaf-studs",
    name: "Gold Leaf Studs",
    price: "1,200",
    availability: "In Stock",
    category: "Jewellery",
    description: "Tiny studs flecked with real gold leaf, set in clear resin. The everyday pair you'll reach for most.",
    images: ["STUDS — FRONT", "STUDS — SIDE", "STUDS — DETAIL", "STUDS — WORN"],
  },
  {
    slug: "ocean-resin-tray",
    name: "Ocean Resin Tray",
    price: "3,500",
    availability: "Crafted to Order",
    category: "Resin Art",
    description: "Swirls of blue and white resin poured to look like the sea, finished with a gold rim. A functional piece of art for your table.",
    images: ["TRAY — TOP", "TRAY — ANGLE", "TRAY — DETAIL", "TRAY — IN USE"],
  },
  {
    slug: "marble-coaster-set",
    name: "Marble Coaster Set",
    price: "2,400",
    availability: "In Stock",
    category: "Resin Art",
    description: "A set of four marble-effect resin coasters with gold edges. Heat-safe and sealed for everyday use.",
    images: ["COASTERS — SET", "COASTERS — SINGLE", "COASTERS — DETAIL", "COASTERS — IN USE"],
  },
  {
    slug: "geode-wall-piece",
    name: "Geode Wall Piece",
    price: "12,000",
    availability: "Crafted to Order",
    category: "Resin Art",
    description: "A large geode-inspired wall piece in deep jewel tones with a crystalline gold centre. A statement made to order for your space.",
    images: ["WALL ART — FULL", "WALL ART — ANGLE", "WALL ART — DETAIL", "WALL ART — ON WALL"],
  },
  {
    slug: "floral-keepsake-frame",
    name: "Floral Keepsake Frame",
    price: "6,800",
    availability: "Crafted to Order",
    category: "Resin Art",
    description: "Your own flowers — from a wedding, a birthday, a memory — preserved forever in a resin frame. Send us the blooms and we'll cast them by hand.",
    images: ["FRAME — FRONT", "FRAME — ANGLE", "FRAME — DETAIL", "FRAME — DISPLAYED"],
  },
];