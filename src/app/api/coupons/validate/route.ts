import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({ code: z.string(), orderTotal: z.number().int().nonnegative() });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

    const { code, orderTotal } = parsed.data;
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon || !coupon.isActive) return NextResponse.json({ error: "Code invalide ou expiré." }, { status: 400 });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return NextResponse.json({ error: "Code expiré." }, { status: 400 });
    if (coupon.startsAt && coupon.startsAt > new Date()) return NextResponse.json({ error: "Code pas encore valide." }, { status: 400 });
    if (coupon.minOrderMillimes && orderTotal < coupon.minOrderMillimes) {
      return NextResponse.json({ error: `Commande minimum: ${(coupon.minOrderMillimes / 1000).toFixed(3)} DT` }, { status: 400 });
    }
    if (coupon.maxUsage && coupon.usageCount >= coupon.maxUsage) return NextResponse.json({ error: "Code épuisé." }, { status: 400 });

    let discountMillimes = 0;
    if (coupon.type === "PERCENTAGE" && coupon.percentage) {
      discountMillimes = Math.round(orderTotal * (coupon.percentage / 100));
    } else if (coupon.type === "FIXED" && coupon.valueMillimes) {
      discountMillimes = Math.min(coupon.valueMillimes, orderTotal);
    }

    return NextResponse.json({ code: coupon.code, discountMillimes, freeShipping: coupon.freeShipping });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
