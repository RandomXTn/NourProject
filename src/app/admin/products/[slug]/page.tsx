import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";

interface Params {
  params: Promise<{ slug: string }>;
}

export default async function EditProductPage({ params }: Params) {
  const { slug } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { slug } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-serif text-3xl font-light text-ivory">Modifier le produit</h1>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          nameFr: product.nameFr ?? "",
          nameAr: product.nameAr ?? "",
          slug: product.slug,
          description: product.description ?? "",
          priceMillimes: product.priceMillimes,
          salePriceMillimes: product.salePriceMillimes,
          categoryId: product.categoryId,
          status: product.status as "ACTIVE" | "DRAFT" | "ARCHIVED",
          isFeatured: product.isFeatured,
          isBestSeller: product.isBestSeller,
          isNewArrival: product.isNewArrival,
          sku: product.sku ?? "",
          material: product.material ?? "",
        }}
      />
    </div>
  );
}
