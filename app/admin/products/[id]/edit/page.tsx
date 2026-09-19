import ProductForm from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    notFound();
  }

  return (
    <ProductForm
      mode="edit"
      productId={product.id}
      initialData={{
        name: product.name,
        price: product.price,
        category: product.category,
        availability: product.availability,
        description: product.description,
        featured: product.featured,
        isExclusive: product.isExclusive,
      }}
    />
  );
}