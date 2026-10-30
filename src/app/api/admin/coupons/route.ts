import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { couponSchema } from "@/lib/validations";

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  try {
    const body = await req.json();
    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

    const data = parsed.data;
    const existing = await prisma.coupon.findUnique({ where: { code: data.code } });
    if (existing) return NextResponse.json({ error: "Ce code existe déjà." }, { status: 400 });

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code,
        type: data.type,
        valueMillimes: data.valueMillimes ?? null,
        percentage: data.percentage ?? null,
        minOrderMillimes: data.minOrderMillimes ?? null,
        maxUsage: data.maxUsage ?? null,
        freeShipping: data.freeShipping,
        isActive: data.isActive,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      },
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
