import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validations";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Params) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

    const data = parsed.data;
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.nameFr !== undefined && { nameFr: data.nameFr || null }),
        ...(data.nameAr !== undefined && { nameAr: data.nameAr || null }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.priceMillimes !== undefined && { priceMillimes: data.priceMillimes }),
        ...(data.salePriceMillimes !== undefined && { salePriceMillimes: data.salePriceMillimes ?? null }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId || null }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.isBestSeller !== undefined && { isBestSeller: data.isBestSeller }),
        ...(data.isNewArrival !== undefined && { isNewArrival: data.isNewArrival }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.sku !== undefined && { sku: data.sku || null }),
        ...(data.material !== undefined && { material: data.material || null }),
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  const { id } = await params;
  await prisma.product.update({ where: { id }, data: { status: "ARCHIVED", deletedAt: new Date() } });
  return NextResponse.json({ ok: true });
}
