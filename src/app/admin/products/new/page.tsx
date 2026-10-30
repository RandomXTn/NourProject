import { prisma } from "@/lib/prisma";
import { ProductForm } from "../product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="font-serif text-3xl font-light text-ivory">Nouveau produit</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
