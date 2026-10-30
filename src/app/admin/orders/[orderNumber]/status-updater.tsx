"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

const ORDER_STATUSES = [
  { value: "PENDING", label: "En attente" },
  { value: "CONFIRMED", label: "Confirmée" },
  { value: "PROCESSING", label: "En traitement" },
  { value: "SHIPPED", label: "Expédiée" },
  { value: "DELIVERED", label: "Livrée" },
  { value: "CANCELLED", label: "Annulée" },
];

const PAY_STATUSES = [
  { value: "PENDING", label: "En attente" },
  { value: "PAID", label: "Payé" },
  { value: "FAILED", label: "Échoué" },
  { value: "REFUNDED", label: "Remboursé" },
];

export function OrderStatusUpdater({ orderId, currentStatus, currentPayment }: { orderId: string; currentStatus: string; currentPayment: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [payment, setPayment] = useState(currentPayment);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus: payment }),
      });
      if (res.ok) {
        toast({ title: "Commande mise à jour", variant: "success" });
        router.refresh();
      } else {
        const j = await res.json();
        toast({ title: "Erreur", description: j.error, variant: "destructive" });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-luxury py-2 text-xs">
        {ORDER_STATUSES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
      </select>
      <select value={payment} onChange={(e) => setPayment(e.target.value)} className="input-luxury py-2 text-xs">
        {PAY_STATUSES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
      </select>
      <button onClick={save} disabled={saving} className="btn-gold btn-sm">{saving ? "…" : "Sauver"}</button>
    </div>
  );
}
