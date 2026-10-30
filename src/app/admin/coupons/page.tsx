import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CouponActions } from "./coupon-actions";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-light text-ivory">Promotions</h1>
        <Link href="/admin/coupons/new" className="btn-gold btn-sm flex items-center gap-2"><Plus className="w-4 h-4" />Nouveau code</Link>
      </div>
      <div className="border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Code", "Type", "Valeur", "Utilisations", "Expire le", "Statut", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-2xs tracking-widest uppercase text-stone font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-obsidian-50">
                <td className="px-4 py-3 font-mono text-gold">{c.code}</td>
                <td className="px-4 py-3 text-stone">{c.type === "PERCENTAGE" ? "%" : "Fixe"}</td>
                <td className="px-4 py-3 text-ivory">
                  {c.type === "PERCENTAGE" ? `${c.percentage}%` : c.valueMillimes ? formatPrice(c.valueMillimes) : "—"}
                </td>
                <td className="px-4 py-3 text-stone">{c.usageCount}{c.maxUsage ? ` / ${c.maxUsage}` : ""}</td>
                <td className="px-4 py-3 text-stone whitespace-nowrap">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("fr-TN") : "Pas d'expiration"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? "bg-green-400/10 text-green-400" : "bg-stone/10 text-stone"}`}>
                    {c.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3"><CouponActions couponId={c.id} isActive={c.isActive} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && <p className="text-center py-12 text-stone">Aucun code promo. <Link href="/admin/coupons/new" className="text-gold">Créer →</Link></p>}
      </div>
    </div>
  );
}
