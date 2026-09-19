import { NextResponse } from "next/server";
import { PAYMENT_METHODS, type PaymentMethod } from "../../../lib/constants";
import { prisma } from "../../../lib/prisma";

const MAX_LINE_ITEMS = 50;
const MAX_QUANTITY = 99;
// Order.totalAmount is a Postgres INT (32-bit).
const MAX_TOTAL_AMOUNT = 2_147_483_647;

// Thrown for anything the client got wrong; surfaced as a 400.
class ValidationError extends Error {}

type ParsedOrder = {
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  // Requested quantity per product slug (duplicate slugs are merged).
  quantities: Map<string, number>;
};

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

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return (PAYMENT_METHODS as readonly unknown[]).includes(value);
}

// Only the customer-supplied fields and the cart's { slug, quantity } pairs are
// read here. Any prices, names or totals in the payload are ignored.
function parseOrder(body: unknown): ParsedOrder {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    throw new ValidationError("Request body must be a JSON object");
  }
  const input = body as Record<string, unknown>;

  const customerName = requireText(input.customerName, "customerName", 100);
  const phone = requireText(input.phone, "phone", 30);
  const address = requireText(input.address, "address", 500);

  if (!isPaymentMethod(input.paymentMethod)) {
    throw new ValidationError(
      `paymentMethod must be one of: ${PAYMENT_METHODS.join(", ")}`
    );
  }

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
      throw new ValidationError(
        `Quantity for "${slug}" can be at most ${MAX_QUANTITY}`
      );
    }
  }

  return { customerName, phone, address, paymentMethod: input.paymentMethod, quantities };
}

// Product.price is a display string such as "1,800". Strip thousands separators
// and require plain digits, mirroring how the cart and checkout parse it.
function parsePrice(price: string): number | null {
  const digits = price.replace(/,/g, "").trim();
  return /^\d+$/.test(digits) ? Number(digits) : null;
}

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError("Request body must be valid JSON");
    }

    const { customerName, phone, address, paymentMethod, quantities } =
      parseOrder(body);

    const products = await prisma.product.findMany({
      where: { slug: { in: [...quantities.keys()] } },
    });
    const productsBySlug = new Map(products.map((p) => [p.slug, p]));

    // Build the order lines from the database's prices, never the client's.
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

    const order = await prisma.order.create({
      data: {
        customerName,
        phone,
        address,
        items: lines,
        totalAmount,
        paymentMethod,
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { success: false, error: "Could not create order" },
      { status: 500 }
    );
  }
}
