import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { z } from "zod";

const itemSchema = z.object({
  productId: z.string(),
  variantId: z.string().nullable().optional(),
  name: z.string(),
  variantName: z.string().nullable().optional(),
  priceMillimes: z.number().int().positive(),
  qty: z.number().int().positive(),
  imageUrl: z.string().nullable().optional(),
});

const orderSchema = z.object({
  guestEmail: z.string().email().optional().or(z.literal("")),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string(),
  governorate: z.string(),
  city: z.string(),
  street: z.string(),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "KONNECT", "CARD_ONLINE"]),
  items: z.array(itemSchema).min(1),
  subtotalMillimes: z.number().int().nonnegative(),
  discountMillimes: z.number().int().nonnegative().default(0),
  shippingMillimes: z.number().int().nonnegative().default(0),
  totalMillimes: z.number().int().positive(),
  couponCode: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Données invalides.", details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;

    // Server-side price verification
    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, status: "ACTIVE" },
      include: { variants: true },
    });

    let computedSubtotal = 0;
    const verifiedItems: Array<{
      productId: string;
      variantId?: string | null;
      name: string;
      variantName?: string | null;
      priceMillimes: number;
      qty: number;
      imageUrl?: string | null;
    }> = [];

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return NextResponse.json({ error: `Produit introuvable: ${item.name}` }, { status: 400 });

      let serverPrice = product.salePriceMillimes ?? product.priceMillimes;
      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) return NextResponse.json({ error: `Variante introuvable.` }, { status: 400 });
        if (variant.stockQty < item.qty) return NextResponse.json({ error: `Stock insuffisant pour: ${item.name}` }, { status: 400 });
        if (variant.priceMillimes !== null) serverPrice = variant.priceMillimes;
      }

      computedSubtotal += serverPrice * item.qty;
      verifiedItems.push({ ...item, priceMillimes: serverPrice });
    }

    // Coupon validation
    let discountMillimes = 0;
    let couponId: string | null = null;
    let freeShipping = false;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
      if (coupon && coupon.isActive) {
        if (!coupon.expiresAt || coupon.expiresAt > new Date()) {
          if (!coupon.startsAt || coupon.startsAt <= new Date()) {
            if (!coupon.minOrderMillimes || computedSubtotal >= coupon.minOrderMillimes) {
              if (!coupon.maxUsage || coupon.usageCount < coupon.maxUsage) {
                if (coupon.type === "PERCENTAGE" && coupon.percentage) {
                  discountMillimes = Math.round(computedSubtotal * (coupon.percentage / 100));
                } else if (coupon.type === "FIXED" && coupon.valueMillimes) {
                  discountMillimes = Math.min(coupon.valueMillimes, computedSubtotal);
                }
                freeShipping = coupon.freeShipping;
                couponId = coupon.id;
              }
            }
          }
        }
      }
    }

    const shippingMillimes = computedSubtotal >= 150000 || freeShipping ? 0 : 8000;
    const totalMillimes = computedSubtotal - discountMillimes + shippingMillimes;

    const shippingSnapshot = JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      governorate: data.governorate,
      city: data.city,
      street: data.street,
      postalCode: data.postalCode,
      notes: data.notes,
    });

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session?.user.id ?? null,
          guestEmail: data.guestEmail || null,
          guestPhone: data.phone,
          shippingSnapshot,
          subtotalMillimes: computedSubtotal,
          discountMillimes,
          shippingMillimes,
          totalMillimes,
          couponId,
          couponCode: data.couponCode ?? null,
          paymentMethod: data.paymentMethod,
          paymentStatus: "PENDING",
          status: "PENDING",
          notes: data.notes ?? null,
          items: {
            create: verifiedItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId ?? null,
              productName: item.name,
              variantName: item.variantName ?? null,
              priceMillimes: item.priceMillimes,
              qty: item.qty,
              imageUrl: item.imageUrl ?? null,
            })),
          },
        },
      });

      // Decrement stock for variants
      for (const item of verifiedItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQty: { decrement: item.qty } },
          });
        }
      }

      // Increment coupon usage
      if (couponId) {
        await tx.coupon.update({ where: { id: couponId }, data: { usageCount: { increment: 1 } } });
      }

      return newOrder;
    });

    return NextResponse.json({ orderNumber: order.orderNumber, id: order.id }, { status: 201 });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json({ error: "Erreur serveur lors de la commande." }, { status: 500 });
  }
}
