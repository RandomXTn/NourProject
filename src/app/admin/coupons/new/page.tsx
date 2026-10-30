"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema } from "@/lib/validations";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

type CouponData = z.infer<typeof couponSchema>;

export default function NewCouponPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CouponData>({
    resolver: zodResolver(couponSchema),
    defaultValues: { type: "PERCENTAGE", isActive: true, freeShipping: false },
  });
  const type = watch("type");

  async function onSubmit(data: CouponData) {
    setSaving(true);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) { toast({ title: "Code créé !", variant: "success" }); router.push("/admin/coupons"); }
    else { const j = await res.json(); toast({ title: "Erreur", description: j.error, variant: "destructive" }); }
  }

  const lc = "block text-xs tracking-widest uppercase text-stone mb-2";
  const ic = "input-luxury w-full";

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-serif text-3xl font-light text-ivory">Nouveau code promo</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div><label className={lc}>Code *</label><input {...register("code")} className={ic} placeholder="NOUR20" /></div>
        <div>
          <label className={lc}>Type *</label>
          <select {...register("type")} className={ic}>
            <option value="PERCENTAGE">Pourcentage (%)</option>
            <option value="FIXED">Montant fixe (DT)</option>
          </select>
        </div>
        {type === "PERCENTAGE" && <div><label className={lc}>Pourcentage *</label><input type="number" {...register("percentage", { valueAsNumber: true })} className={ic} placeholder="20" />{errors.percentage && <p className="text-xs text-red-400 mt-1">{errors.percentage.message}</p>}</div>}
        {type === "FIXED" && <div><label className={lc}>Montant en millimes *</label><input type="number" {...register("valueMillimes", { valueAsNumber: true })} className={ic} placeholder="20000 = 20 DT" /></div>}
        <div><label className={lc}>Commande min. (millimes)</label><input type="number" {...register("minOrderMillimes", { valueAsNumber: true })} className={ic} placeholder="50000 = 50 DT" /></div>
        <div><label className={lc}>Utilisations max.</label><input type="number" {...register("maxUsage", { valueAsNumber: true })} className={ic} placeholder="Illimité" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={lc}>Date de début</label><input type="datetime-local" {...register("startsAt")} className={ic} /></div>
          <div><label className={lc}>Date d'expiration</label><input type="datetime-local" {...register("expiresAt")} className={ic} /></div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" {...register("freeShipping")} className="accent-gold" /><span className="text-sm text-stone">Livraison gratuite incluse</span></label>
        <div className="flex gap-4">
          <button type="submit" disabled={saving} className="btn-gold">{saving ? "…" : "Créer"}</button>
          <button type="button" onClick={() => router.push("/admin/coupons")} className="btn-ghost">Annuler</button>
        </div>
      </form>
    </div>
  );
}
