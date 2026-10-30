import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPageClient } from "./shop-client";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Découvrez toute la collection NOUR — bijoux, montres, sacs et lunettes de soleil.",
};

async function getShopData() {
  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { status: "ACTIVE" },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 2 },
          variants: { where: { isActive: true } },
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);
    return { products, categories };
  } catch {
    return { products: [], categories: [] };
  }
}

export default async function ShopPage() {
  const { products, categories } = await getShopData();

  return (
    <div className="pt-24">
      <Suspense fallback={<div className="container-luxury py-20 text-stone text-center">Chargement...</div>}>
        <ShopPageClient products={products} categories={categories} />
      </Suspense>
    </div>
  );
}
