import { prisma } from "./prisma";

const MAX_LINE_ITEMS = 50;
const MAX_QUANTITY = 99;
// Order.totalAmount is a Postgres INT (32-bit).
const MAX_TOTAL_AMOUNT = 2_147_483_647;

// Thrown for anything the client got wrong; callers turn this into a 400.
export class ValidationError extends Error {}

function requireText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`${field} is required`);
  }
  const text = value.trim();
  if (text.length > maxLength) {
    throw new ValidationError(`${field} must be at most ${maxLength} characters`);
  }
  return text;
}

export function parseShippingDetails(input: Record<string, unknown>): {
  customerName: string;
  phone: string;
  address: string;
} {
  return {
    customerName: requireText(input.customerName, "customerName", 100),
    phone: requireText(input.phone, "phone", 30),
    address: requireText(input.address, "address", 500),
  };
}

// Requested quantity per product slug (duplicate slugs are merged).
export function parseCartItems(input: Record<string, unknown>): Map<string, number> {
  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new ValidationError("items must be a non-empty array");
  }
  if (input.items.length > MAX_LINE_ITEMS) {
    throw new ValidationError(`An order can have at most ${MAX_LINE_ITEMS} items`);
  }

  const quantities = new Map<string, number>();
  for (const raw of input.items) {
    if (typeof raw !== "object" || raw === null) {
      throw new ValidationError("Each item must be an object");
    }
    const { slug, quantity } = raw as Record<string, unknown>;
    if (typeof slug !== "string" || slug.trim() === "") {
      throw new ValidationError("Each item needs a product slug");
    }
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1) {
      throw new ValidationError(
        `Quantity for "${slug}" must be a whole number of at least 1`
      );
    }
    quantities.set(slug, (quantities.get(slug) ?? 0) + quantity);
  }

  for (const [slug, quantity] of quantities) {
    if (quantity > MAX_QUANTITY) {
      throw new ValidationError(`Quantity for "${slug}" can be at most ${MAX_QUANTITY}`);
    }
  }

  return quantities;
}

// Product.price is a display string such as "1,800". Strip thousands separators
// and require plain digits, mirroring how the cart and checkout parse it.
function parsePrice(price: string): number | null {
  const digits = price.replace(/,/g, "").trim();
  return /^\d+$/.test(digits) ? Number(digits) : null;
}

export type OrderLineInput = {
  productId: string;
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

// Builds order lines from the database's current prices, never the client's —
// every order, on any payment method, is re-priced from here.
export async function buildOrderLines(
  quantities: Map<string, number>
): Promise<{ lines: OrderLineInput[]; totalAmount: number }> {
  const products = await prisma.product.findMany({
    where: { slug: { in: [...quantities.keys()] } },
  });
  const productsBySlug = new Map(products.map((p) => [p.slug, p]));

  let totalAmount = 0;
  const lines = [...quantities].map(([slug, quantity]) => {
    const product = productsBySlug.get(slug);
    if (!product) {
      throw new ValidationError(`Product not found: "${slug}"`);
    }
    const unitPrice = parsePrice(product.price);
    if (unitPrice === null) {
      throw new ValidationError(
        `"${product.name}" has an invalid price and cannot be ordered`
      );
    }
    const lineTotal = unitPrice * quantity;
    totalAmount += lineTotal;
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      unitPrice,
      quantity,
      lineTotal,
    };
  });

  if (totalAmount > MAX_TOTAL_AMOUNT) {
    throw new ValidationError("Order total is too large");
  }

  return { lines, totalAmount };
}

// LRI-2026-0001, sequential per year. Mirrors the product slug generator:
// scans for what's already taken and picks the next free one, rather than a
// counter table — fine at this order volume.
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `LRI-${year}-`;

  const existing = await prisma.order.findMany({
    where: { orderNumber: { startsWith: prefix } },
    select: { orderNumber: true },
  });
  const usedSequences = new Set(
    existing
      .map((o) => Number(o.orderNumber.slice(prefix.length)))
      .filter((n) => Number.isInteger(n))
  );

  let sequence = 1;
  while (usedSequences.has(sequence)) sequence++;

  return `${prefix}${String(sequence).padStart(4, "0")}`;
}
