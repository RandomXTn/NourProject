import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ProductPageClient } from "./product-client";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, metaTitle: true, metaDesc: true, images: { take: 1, select: { url: true } } },
  });
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDesc ?? undefined,
    openGraph: {
      images: product.images[0] ? [product.images[0].url] : [],
    },
  };
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { where: { isActive: true }, orderBy: { sortOrder: "asc" } },
      category: true,
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true, name: true, rating: true, title: true, body: true, createdAt: true,
        },
      },
    },
  });
}

async function getRelated(categoryId: string | null, excludeId: string) {
  if (!categoryId) return [];
  return prisma.product.findMany({
    where: { categoryId, status: "ACTIVE", id: { not: excludeId } },
    include: { images: { take: 1, orderBy: { sortOrder: "asc" } }, variants: { take: 3 } },
    take: 4,
    orderBy: { sortOrder: "asc" },
  });
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product.categoryId, product.id);

  return (
    <div className="pt-18">
      <ProductPageClient product={product} related={related} />
    </div>
  );
}
