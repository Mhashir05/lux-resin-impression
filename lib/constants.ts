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

// Admin-facing names for the stored payment method values.
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  advance: "Advance Transfer",
  "transfer-on-delivery": "Transfer on Delivery",
  cod: "Cash on Delivery",
};

// Order.status is a plain string in the database. "New" is the schema default
// and what the admin dashboard counts; the rest is the fulfilment flow.
export const ORDER_STATUSES = [
  "New",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
