import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validations";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  const products = await prisma.product.findMany({
    include: { images: { take: 1 }, category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) return NextResponse.json({ error: "Ce slug est déjà utilisé." }, { status: 400 });

    const product = await prisma.product.create({
      data: {
        name: data.name,
        nameFr: data.nameFr || null,
        nameAr: data.nameAr || null,
        slug: data.slug,
        description: data.description || null,
        descFr: data.descFr || null,
        descAr: data.descAr || null,
        priceMillimes: data.priceMillimes,
        salePriceMillimes: data.salePriceMillimes ?? null,
        categoryId: data.categoryId || null,
        isFeatured: data.isFeatured,
        isBestSeller: data.isBestSeller,
        isNewArrival: data.isNewArrival,
        status: data.status,
        sku: data.sku || null,
        material: data.material || null,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
