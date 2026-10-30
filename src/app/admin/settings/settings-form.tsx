"use client";

import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ShippingZone { id: string; name: string; feeMillimes: number; freeThreshold: number | null; isActive: boolean; }

export function SettingsForm({ settings, zones }: { settings: Record<string, string>; zones: ShippingZone[] }) {
  const [storeName, setStoreName] = useState(settings.storeName ?? "NOUR");
  const [storeEmail, setStoreEmail] = useState(settings.storeEmail ?? "");
  const [storePhone, setStorePhone] = useState(settings.storePhone ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeName, storeEmail, storePhone }),
    });
    setSaving(false);
    toast({ title: "Paramètres sauvegardés", variant: "success" });
  }

  const lc = "block text-xs tracking-widest uppercase text-stone mb-2";
  const ic = "input-luxury w-full";

  return (
    <div className="space-y-8">
      <section className="border border-border p-6 space-y-5">
        <h2 className="text-xs font-medium tracking-widest uppercase text-ivory">Informations de la boutique</h2>
        <div><label className={lc}>Nom de la boutique</label><input value={storeName} onChange={(e) => setStoreName(e.target.value)} className={ic} /></div>
        <div><label className={lc}>Email de contact</label><input type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} className={ic} /></div>
        <div><label className={lc}>Téléphone</label><input value={storePhone} onChange={(e) => setStorePhone(e.target.value)} className={ic} /></div>
        <button onClick={save} disabled={saving} className="btn-gold">{saving ? "Sauvegarde…" : "Sauvegarder"}</button>
      </section>

      <section className="border border-border p-6 space-y-4">
        <h2 className="text-xs font-medium tracking-widest uppercase text-ivory">Zones de livraison</h2>
        {zones.length === 0 ? (
          <p className="text-sm text-stone">Aucune zone configurée. Ajoutez des zones via la base de données ou un seed.</p>
        ) : (
          <div className="divide-y divide-border">
            {zones.map((z) => (
              <div key={z.id} className="flex items-center justify-between py-3">
                <p className="text-sm text-ivory">{z.name}</p>
                <div className="text-right">
                  <p className="text-xs text-gold">{(z.feeMillimes / 1000).toFixed(3)} DT</p>
                  {z.freeThreshold && <p className="text-2xs text-stone">Gratuit dès {(z.freeThreshold / 1000).toFixed(3)} DT</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
