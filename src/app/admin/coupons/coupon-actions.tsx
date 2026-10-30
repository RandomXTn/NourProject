"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export function CouponActions({ couponId, isActive }: { couponId: string; isActive: boolean }) {
  const router = useRouter();

  async function toggle() {
    const res = await fetch(`/api/admin/coupons/${couponId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) { toast({ title: isActive ? "Code désactivé" : "Code activé" }); router.refresh(); }
  }

  async function del() {
    if (!confirm("Supprimer ce code promo ?")) return;
    const res = await fetch(`/api/admin/coupons/${couponId}`, { method: "DELETE" });
    if (res.ok) { toast({ title: "Code supprimé" }); router.refresh(); }
  }

  return (
    <div className="flex gap-2">
      <button onClick={toggle} className="text-xs text-stone hover:text-ivory transition-colors">{isActive ? "Désactiver" : "Activer"}</button>
      <button onClick={del} className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Supprimer</button>
    </div>
  );
}
