import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const schema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED", "PARTIALLY_REFUNDED"]).optional(),
  trackingNumber: z.string().optional(),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Params) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  const { id } = await params;
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

    const updateData: Prisma.OrderUpdateInput = { ...parsed.data };
    if (parsed.data.paymentStatus === "PAID") updateData.paidAt = new Date();
    if (parsed.data.status === "CANCELLED") updateData.cancelledAt = new Date();

    const order = await prisma.order.update({ where: { id }, data: updateData });

    await prisma.auditLog.create({
      data: {
        userId: admin.user.id,
        action: "ORDER_STATUS_UPDATE",
        entity: "Order",
        entityId: id,
        newValue: JSON.stringify(parsed.data),
      },
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
