import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ShopPageClient } from "@/app/(storefront)/shop/shop-client";

const COLLECTION_META: Record<string, { title: string; description: string; categorySlug?: string }> = {
  jewelry: { title: "Bijoux", description: "Découvrez notre collection de bijoux de luxe.", categorySlug: "jewelry" },
  watches: { title: "Montres", description: "Montres de prestige pour chaque occasion.", categorySlug: "watches" },
  bags: { title: "Sacs", description: "Sacs de luxe et maroquinerie haut de gamme.", categorySlug: "bags" },
  sunglasses: { title: "Lunettes de soleil", description: "Lunettes de soleil de créateurs.", categorySlug: "sunglasses" },
  "new-arrivals": { title: "Nouveautés", description: "Nos dernières arrivées." },
  "best-sellers": { title: "Meilleures ventes", description: "Les produits les plus appréciés." },
};

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const meta = COLLECTION_META[slug];
  if (!meta) return { title: "Collection" };
  return { title: meta.title, description: meta.description };
}

export default async function CollectionPage({ params }: Params) {
  const { slug } = await params;
  const meta = COLLECTION_META[slug];
  if (!meta) notFound();

  let whereClause: Prisma.ProductWhereInput = { status: "ACTIVE" };

  if (slug === "new-arrivals") {
    whereClause = { ...whereClause, isNewArrival: true };
  } else if (slug === "best-sellers") {
    whereClause = { ...whereClause, isBestSeller: true };
  } else if (meta.categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: meta.categorySlug },
    });
    if (category) {
      whereClause = { ...whereClause, categoryId: category.id };
    }
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 2 },
        variants: { where: { isActive: true } },
        category: true,
      },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="pt-24">
      <div className="container-luxury py-12 text-center border-b border-border mb-10">
        <span className="gold-line mb-4" />
        <h1 className="font-serif text-5xl font-light text-ivory mt-4">
          {meta.title}
        </h1>
        <p className="text-stone text-sm mt-3">{meta.description}</p>
      </div>
      <ShopPageClient products={products} categories={categories} />
    </div>
  );
}
