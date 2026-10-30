import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];
  const q = searchParams.get("q")?.trim();

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(ids.length ? { id: { in: ids } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { nameFr: { contains: q } },
              { sku: { contains: q } },
            ],
          }
        : {}),
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
      variants: { where: { isActive: true } },
    },
    take: 48,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}
