export type OrderLine = {
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Order.items is a Json column. POST /api/orders stores
// { productId, slug, name, unitPrice, quantity, lineTotal } per line.
// Orders placed before that validation went in hold the raw cart instead,
// { slug, name, price: "1,800", image, quantity }, so read those too rather
// than hiding what a customer ordered. `unreadable` counts entries that fit
// neither shape.
export function parseOrderLines(items: unknown): {
  lines: OrderLine[];
  unreadable: number;
} {
  if (!Array.isArray(items)) {
    return { lines: [], unreadable: 1 };
  }

  const lines: OrderLine[] = [];
  let unreadable = 0;

  for (const raw of items) {
    if (!isRecord(raw)) {
      unreadable++;
      continue;
    }
    const { name, quantity } = raw;
    if (typeof name !== "string" || typeof quantity !== "number") {
      unreadable++;
      continue;
    }

    let unitPrice: number | null = null;
    if (typeof raw.unitPrice === "number") {
      unitPrice = raw.unitPrice;
    } else if (typeof raw.price === "string") {
      const digits = raw.price.replace(/,/g, "").trim();
      if (/^\d+$/.test(digits)) unitPrice = Number(digits);
    }
    if (unitPrice === null) {
      unreadable++;
      continue;
    }

    lines.push({
      name,
      unitPrice,
      quantity,
      lineTotal: typeof raw.lineTotal === "number" ? raw.lineTotal : unitPrice * quantity,
    });
  }

  return { lines, unreadable };
}

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString("en-US")}`;
}

// Orders are placed in Pakistan; format dates there whatever the server's zone.
const DATE_ZONE = "Asia/Karachi";

export function formatOrderDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: DATE_ZONE,
  });
}

export function formatOrderDateTime(date: Date): string {
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: DATE_ZONE,
  });
}

// Short display form of the order's UUID, e.g. "#3F9A1C2B".
export function shortOrderId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`;
}
