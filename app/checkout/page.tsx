import { redirect } from "next/navigation";
import CheckoutForm from "../../components/CheckoutForm";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session || session.user.role !== "customer") {
    redirect("/login?redirect=/checkout");
  }

  const customer = await prisma.customer.findUnique({
    where: { id: session.user.id },
    select: { name: true, phone: true, address: true },
  });

  return (
    <CheckoutForm
      initialName={customer?.name ?? ""}
      initialPhone={customer?.phone ?? ""}
      initialAddress={customer?.address ?? ""}
    />
  );
}
