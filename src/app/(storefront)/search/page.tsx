import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product/product-card";

export const metadata: Metadata = {
  title: "Recherche",
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const products = query
    ? await prisma.product.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { name: { contains: query } },
            { nameFr: { contains: query } },
            { sku: { contains: query } },
          ],
        },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 2 },
          variants: { where: { isActive: true } },
        },
        take: 48,
      })
    : [];

  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury">
        <div className="py-12 text-center border-b border-border mb-10">
          <h1 className="font-serif text-4xl font-light text-ivory">Recherche</h1>
          <p className="text-stone text-sm mt-3">
            {query
              ? `${products.length} résultat${products.length !== 1 ? "s" : ""} pour « ${query} »`
              : "Saisissez un mot-clé dans la barre de recherche."}
          </p>
        </div>
        {products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
