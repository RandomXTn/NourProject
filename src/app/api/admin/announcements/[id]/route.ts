import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";

interface Params {
  params: Promise<{ id: string }>;
}

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  text: z.string().min(2).optional(),
});

export async function PATCH(req: Request, { params }: Params) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  const { id } = await params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const announcement = await prisma.announcement.update({ where: { id }, data: parsed.data });
  return NextResponse.json(announcement);
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  const { id } = await params;
  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
