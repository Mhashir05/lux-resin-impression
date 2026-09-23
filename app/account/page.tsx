import { redirect } from "next/navigation";
import AccountOrders, { type AccountOrder } from "../../components/AccountOrders";
import AccountPasswordForm from "../../components/AccountPasswordForm";
import AccountProfileForm from "../../components/AccountProfileForm";
import Footer from "../../components/Footer";
import { auth } from "../../lib/auth";
import { formatOrderDate, formatOrderDateTime, formatPKR, parseOrderLines } from "../../lib/orders";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

// "Shipped or later" in the fulfilment sense. Cancelled is last in
// ORDER_STATUSES but isn't a shipping milestone, so it's deliberately not
// included here even though it comes after Shipped in that list.
const COURIER_VISIBLE_STATUSES = new Set(["Shipped", "Delivered"]);

export default async function AccountPage() {
  const session = await auth();
  if (!session || session.user.role !== "customer") {
    redirect("/login?redirect=/account");
  }

  // Everything below is scoped to session.user.id — never a client-supplied id.
  const customer = await prisma.customer.findUnique({
    where: { id: session.user.id },
  });
  if (!customer) {
    redirect("/login?redirect=/account");
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { statusHistory: { orderBy: { changedAt: "asc" } } },
  });

  const accountOrders: AccountOrder[] = orders.map((order) => {
    const { lines, unreadable } = parseOrderLines(order.items);
    const hasCourierDetails = Boolean(
      order.courierService || order.riderName || order.riderPhone || order.trackingId
    );

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      dateLabel: formatOrderDate(order.createdAt),
      totalLabel: formatPKR(order.totalAmount),
      status: order.status,
      lines,
      unreadableLineCount: unreadable,
      courier:
        COURIER_VISIBLE_STATUSES.has(order.status) && hasCourierDetails
          ? {
              service: order.courierService,
              riderName: order.riderName,
              riderPhone: order.riderPhone,
              trackingId: order.trackingId,
            }
          : null,
      history: order.statusHistory.map((step) => ({
        status: step.status,
        dateLabel: formatOrderDateTime(step.changedAt),
      })),
    };
  });

  return (
    <main className="min-h-screen bg-white">
      <section className="px-6 pt-24 pb-4 max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.25em] text-[#B8933E] mb-3">YOUR</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1D1D1F]">
          My <span className="text-[#B8933E]">Account</span>
        </h1>
        <div className="w-16 h-[2px] bg-[#B8933E] mt-3"></div>
      </section>

      <section className="px-6 py-10 max-w-4xl mx-auto grid md:grid-cols-2 gap-6 items-start">
        <AccountProfileForm
          email={customer.email}
          initialName={customer.name}
          initialPhone={customer.phone}
          initialAddress={customer.address}
        />
        <AccountPasswordForm />
      </section>

      <section className="px-6 py-10 pb-24 max-w-4xl mx-auto">
        <h2 className="text-sm text-[#1D1D1F] font-medium mb-4">My Orders</h2>
        <AccountOrders orders={accountOrders} />
      </section>

      <Footer />
    </main>
  );
}
