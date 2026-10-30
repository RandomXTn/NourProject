import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";

const schema = z.object({
  text: z.string().min(2),
  link: z.string().optional(),
});

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const announcement = await prisma.announcement.create({ data: parsed.data });
  return NextResponse.json(announcement, { status: 201 });
}
