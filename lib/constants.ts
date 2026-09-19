// Single source of truth for the fixed vocabularies used across the store.
// Product.category / Product.availability and Order.paymentMethod are plain
// strings in the database, so these values must match exactly everywhere.

export const CATEGORY = {
  JEWELLERY: "Jewellery",
  RESIN_ART: "Resin Art",
} as const;

export const CATEGORIES = [CATEGORY.JEWELLERY, CATEGORY.RESIN_ART] as const;

export type Category = (typeof CATEGORIES)[number];

export const AVAILABILITY_STATUS = {
  IN_STOCK: "In Stock",
  CRAFTED_TO_ORDER: "Crafted to Order",
} as const;

export const AVAILABILITY = [
  AVAILABILITY_STATUS.IN_STOCK,
  AVAILABILITY_STATUS.CRAFTED_TO_ORDER,
] as const;

export type Availability = (typeof AVAILABILITY)[number];

// Values sent by the checkout page's payment radio buttons.
export const PAYMENT_METHODS = ["advance", "transfer-on-delivery", "cod"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
