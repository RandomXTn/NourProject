"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cartSubtotal, useCartStore } from "@/store/cart";
import { formatPrice, GOVERNORATES } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ShoppingBag, CreditCard, Truck, Tag, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const checkoutFormSchema = z.object({
  guestEmail: z.string().email("Email invalide").optional().or(z.literal("")),
  firstName: z.string().min(2, "Prénom requis"),
  lastName: z.string().min(2, "Nom requis"),
  phone: z.string().regex(/^(\+?216)?[2-9]\d{7}$/, "Numéro invalide"),
  governorate: z.string().min(1, "Gouvernorat requis"),
  city: z.string().min(2, "Ville requise"),
  street: z.string().min(5, "Adresse requise"),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "KONNECT"]),
});

type CheckoutForm = z.infer<typeof checkoutFormSchema>;

export function CheckoutClient() {
  const router = useRouter();
  const { items, discountMillimes, couponCode, applyCoupon: storeApplyCoupon, clearCart } = useCartStore();
  const subtotalMillimes = cartSubtotal(items);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; freeShipping?: boolean } | null>(
    couponCode ? { code: couponCode, discount: discountMillimes } : null
  );
  const [couponLoading, setCouponLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const shippingMillimes = subtotalMillimes >= 150000 || appliedCoupon?.freeShipping ? 0 : 8000;
  const totalMillimes = Math.max(0, subtotalMillimes - discountMillimes) + shippingMillimes;

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: { paymentMethod: "CASH_ON_DELIVERY" },
  });

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, orderTotal: subtotalMillimes }),
      });
      const json = await res.json();
      if (res.ok) {
        setAppliedCoupon({
          code: json.code,
          discount: json.discountMillimes,
          freeShipping: json.freeShipping,
        });
        storeApplyCoupon(json.code, json.discountMillimes);
        toast({ title: "Code appliqué !", description: `Réduction: ${formatPrice(json.discountMillimes)}`, variant: "success" });
      } else {
        toast({ title: "Code invalide", description: json.error, variant: "destructive" });
      }
    } finally {
      setCouponLoading(false);
    }
  }

  async function onSubmit(data: CheckoutForm) {
    if (items.length === 0) {
      toast({ title: "Panier vide", description: "Ajoutez des produits avant de commander.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            variantName: i.variant ? `${i.variant.name}: ${i.variant.value}` : null,
            priceMillimes: i.priceMillimes,
            qty: i.qty,
            imageUrl: i.imageUrl,
          })),
          subtotalMillimes,
          discountMillimes,
          shippingMillimes,
          totalMillimes,
          couponCode: appliedCoupon?.code ?? couponCode,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        clearCart();
        router.push(`/order-confirmation?order=${json.orderNumber}`);
      } else {
        toast({ title: "Erreur lors de la commande", description: json.error ?? "Réessayez.", variant: "destructive" });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 space-y-6">
        <ShoppingBag className="w-12 h-12 text-stone/30 mx-auto" />
        <p className="font-serif text-2xl font-light text-ivory">Votre panier est vide</p>
        <Link href="/shop" className="btn-gold inline-flex">Explorer la boutique</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left — Address & Payment */}
        <div className="lg:col-span-3 space-y-8">
          {/* Contact */}
          <section className="border border-border p-6 space-y-5">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-ivory flex items-center gap-2">
              <span className="w-6 h-6 bg-gold text-obsidian text-xs font-bold flex items-center justify-center">1</span>
              Coordonnées
            </h2>
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone mb-2">Email (optionnel pour invité)</label>
              <input type="email" {...register("guestEmail")} className="input-luxury" placeholder="vous@exemple.com" />
              {errors.guestEmail && <p className="mt-1 text-xs text-red-400">{errors.guestEmail.message}</p>}
            </div>
          </section>

          {/* Delivery */}
          <section className="border border-border p-6 space-y-5">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-ivory flex items-center gap-2">
              <span className="w-6 h-6 bg-gold text-obsidian text-xs font-bold flex items-center justify-center">2</span>
              Adresse de livraison
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "firstName", label: "Prénom", placeholder: "Prénom" },
                { id: "lastName", label: "Nom", placeholder: "Nom" },
              ].map(({ id, label, placeholder }) => (
                <div key={id}>
                  <label className="block text-xs tracking-widest uppercase text-stone mb-2">{label}</label>
                  <input {...register(id as keyof CheckoutForm)} className="input-luxury" placeholder={placeholder} />
                  {errors[id as keyof CheckoutForm] && <p className="mt-1 text-xs text-red-400">{errors[id as keyof CheckoutForm]?.message}</p>}
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone mb-2">Téléphone</label>
              <input type="tel" {...register("phone")} className="input-luxury" placeholder="+216 XX XXX XXX" />
              {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone mb-2">Gouvernorat</label>
                <select {...register("governorate")} className="input-luxury">
                  <option value="">Choisir…</option>
                  {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.governorate && <p className="mt-1 text-xs text-red-400">{errors.governorate.message}</p>}
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone mb-2">Ville</label>
                <input {...register("city")} className="input-luxury" placeholder="Ville" />
                {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-stone mb-2">Adresse</label>
              <input {...register("street")} className="input-luxury" placeholder="Rue, numéro…" />
              {errors.street && <p className="mt-1 text-xs text-red-400">{errors.street.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone mb-2">Code postal (optionnel)</label>
                <input {...register("postalCode")} className="input-luxury" placeholder="Code postal" />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-stone mb-2">Notes (optionnel)</label>
                <input {...register("notes")} className="input-luxury" placeholder="Instructions livraison…" />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="border border-border p-6 space-y-4">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-ivory flex items-center gap-2">
              <span className="w-6 h-6 bg-gold text-obsidian text-xs font-bold flex items-center justify-center">3</span>
              Mode de paiement
            </h2>
            {[
              { value: "CASH_ON_DELIVERY", label: "Paiement à la livraison", desc: "Payez en espèces à la réception", icon: Truck },
              { value: "KONNECT", label: "Paiement en ligne — Konnect", desc: "Carte bancaire, virement, etc.", icon: CreditCard },
            ].map(({ value, label, desc, icon: Icon }) => (
              <label key={value} className="flex items-start gap-4 p-4 border border-border cursor-pointer hover:border-gold/50 transition-colors has-[:checked]:border-gold has-[:checked]:bg-gold/5">
                <input type="radio" {...register("paymentMethod")} value={value} className="mt-1 accent-gold" />
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-sm text-ivory font-medium">{label}</p>
                    <p className="text-xs text-stone mt-0.5">{desc}</p>
                  </div>
                </div>
              </label>
            ))}
          </section>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-border p-6 space-y-4">
            <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-ivory">Récapitulatif</h2>
            <ul className="space-y-3 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-16 bg-obsidian-100 flex-shrink-0">
                    {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" />}
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gold text-obsidian text-[10px] font-bold rounded-full flex items-center justify-center">{item.qty}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ivory truncate">{item.name}</p>
                    {item.variant && <p className="text-2xs text-stone">{item.variant.value}</p>}
                  </div>
                  <span className="text-xs text-ivory whitespace-nowrap">{formatPrice(item.priceMillimes * item.qty)}</span>
                </li>
              ))}
            </ul>

            {/* Coupon */}
            <div className="flex gap-2 pt-2 border-t border-border">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Code promo"
                className="input-luxury flex-1 py-2.5 text-xs"
              />
              <button type="button" onClick={applyCoupon} disabled={couponLoading} className="btn-outline-gold btn-sm flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {couponLoading ? "…" : "Appliquer"}
              </button>
            </div>
            {appliedCoupon && (
              <div className="flex items-center gap-2 text-xs text-gold">
                <Check className="w-3.5 h-3.5" />
                <span>{appliedCoupon.code} — -{formatPrice(appliedCoupon.discount)}</span>
              </div>
            )}

            {/* Totals */}
            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex justify-between text-sm text-stone"><span>Sous-total</span><span className="text-ivory">{formatPrice(subtotalMillimes)}</span></div>
              {(appliedCoupon?.discount ?? discountMillimes) > 0 && (
                <div className="flex justify-between text-sm text-stone"><span>Réduction</span><span className="text-gold">-{formatPrice(appliedCoupon?.discount ?? discountMillimes)}</span></div>
              )}
              <div className="flex justify-between text-sm text-stone">
                <span>Livraison</span>
                <span className={shippingMillimes === 0 ? "text-gold" : "text-ivory"}>{shippingMillimes === 0 ? "Gratuite" : formatPrice(shippingMillimes)}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-border pt-3">
                <span className="text-xs tracking-widest uppercase text-ivory">Total</span>
                <span className="font-serif text-lg text-gold">{formatPrice(totalMillimes - (appliedCoupon?.discount ?? 0))}</span>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-gold w-full justify-center">
              {submitting ? "Traitement…" : "Confirmer la commande"}
            </button>
            <p className="text-2xs text-stone/50 text-center">Commande sécurisée. Paiement vérifié côté serveur.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
