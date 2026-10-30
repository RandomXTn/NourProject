"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/lib/validations";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

type ProductData = z.infer<typeof productSchema>;
interface Category { id: string; name: string; slug: string; }

interface ProductFormProps {
  categories: Category[];
  product?: Partial<ProductData> & { id?: string; slug?: string };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isEdit = !!product?.id;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      nameFr: product?.nameFr ?? "",
      slug: product?.slug ?? "",
      description: product?.description ?? "",
      priceMillimes: product?.priceMillimes ?? 0,
      salePriceMillimes: product?.salePriceMillimes ?? null,
      categoryId: product?.categoryId ?? null,
      status: product?.status ?? "DRAFT",
      isFeatured: product?.isFeatured ?? false,
      isBestSeller: product?.isBestSeller ?? false,
      isNewArrival: product?.isNewArrival ?? true,
      sku: product?.sku ?? "",
      material: product?.material ?? "",
    },
  });

  const nameVal = watch("name");

  function autoSlug() {
    if (!nameVal) return;
    const slug = nameVal.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    setValue("slug", slug);
  }

  async function onSubmit(data: ProductData) {
    setSaving(true);
    try {
      const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Erreur", description: json.error, variant: "destructive" });
        return;
      }
      toast({ title: isEdit ? "Produit mis à jour" : "Produit créé", variant: "success" });
      router.push("/admin/products");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "input-luxury w-full";
  const labelClass = "block text-xs tracking-widest uppercase text-stone mb-2";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <section className="border border-border p-6 space-y-5">
        <h2 className="text-xs font-medium tracking-widest uppercase text-ivory">Informations générales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>Nom du produit *</label>
            <input {...register("name")} onBlur={autoSlug} className={inputClass} placeholder="Nom du produit" />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Nom (Français)</label>
            <input {...register("nameFr")} className={inputClass} placeholder="Nom en français" />
          </div>
          <div>
            <label className={labelClass}>Nom (Arabe)</label>
            <input {...register("nameAr")} className={inputClass} dir="rtl" placeholder="الاسم بالعربية" />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Slug URL *</label>
            <input {...register("slug")} className={inputClass} placeholder="slug-du-produit" />
            {errors.slug && <p className="mt-1 text-xs text-red-400">{errors.slug.message}</p>}
          </div>
          <div>
            <label className={labelClass}>SKU</label>
            <input {...register("sku")} className={inputClass} placeholder="NR-001" />
          </div>
          <div>
            <label className={labelClass}>Matière</label>
            <input {...register("material")} className={inputClass} placeholder="Or 18k, Acier inox…" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea {...register("description")} rows={4} className={inputClass} placeholder="Description du produit…" />
        </div>
      </section>

      {/* Pricing */}
      <section className="border border-border p-6 space-y-5">
        <h2 className="text-xs font-medium tracking-widest uppercase text-ivory">Prix (en millimes — 1 TND = 1000)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Prix normal (millimes) *</label>
            <input type="number" {...register("priceMillimes", { valueAsNumber: true })} className={inputClass} placeholder="ex: 150000 = 150 DT" />
            {errors.priceMillimes && <p className="mt-1 text-xs text-red-400">{errors.priceMillimes.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Prix promo (millimes)</label>
            <input type="number" {...register("salePriceMillimes", { valueAsNumber: true })} className={inputClass} placeholder="Laisser vide si aucune promo" />
          </div>
        </div>
      </section>

      {/* Category & Status */}
      <section className="border border-border p-6 space-y-5">
        <h2 className="text-xs font-medium tracking-widest uppercase text-ivory">Catégorie & Statut</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Catégorie</label>
            <select {...register("categoryId")} className={inputClass}>
              <option value="">Sans catégorie</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Statut</label>
            <select {...register("status")} className={inputClass}>
              <option value="DRAFT">Brouillon</option>
              <option value="ACTIVE">Actif</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "isFeatured", label: "En vedette" },
            { name: "isBestSeller", label: "Meilleure vente" },
            { name: "isNewArrival", label: "Nouveauté" },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register(name as keyof ProductData)} className="accent-gold" />
              <span className="text-sm text-stone hover:text-ivory transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saving ? "Enregistrement…" : isEdit ? "Mettre à jour" : "Créer le produit"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")} className="btn-ghost">
          Annuler
        </button>
      </div>
    </form>
  );
}
