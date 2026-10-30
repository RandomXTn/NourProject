import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { take: 1, orderBy: { sortOrder: "asc" } },
      variants: { select: { stockQty: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStock = (p: typeof products[0]) => p.variants.reduce((s, v) => s + v.stockQty, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-light text-ivory">Produits</h1>
        <Link href="/admin/products/new" className="btn-gold btn-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouveau produit
        </Link>
      </div>

      <div className="border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Produit", "Catégorie", "Prix", "Stock", "Statut", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-2xs tracking-widest uppercase text-stone font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-obsidian-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0].url} alt={product.name} className="w-10 h-12 object-cover bg-obsidian-100" />
                    )}
                    <div>
                      <p className="text-ivory text-sm">{product.name}</p>
                      {product.sku && <p className="text-2xs text-stone font-mono">{product.sku}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-stone">{product.category?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <p className="text-gold">{formatPrice(product.salePriceMillimes ?? product.priceMillimes)}</p>
                  {product.salePriceMillimes && <p className="text-2xs text-stone line-through">{formatPrice(product.priceMillimes)}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs ${totalStock(product) === 0 ? "text-red-400" : totalStock(product) <= 5 ? "text-yellow-400" : "text-green-400"}`}>
                    {totalStock(product)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    product.status === "ACTIVE" ? "bg-green-400/10 text-green-400" :
                    product.status === "DRAFT" ? "bg-yellow-400/10 text-yellow-400" :
                    "bg-stone/10 text-stone"
                  }`}>
                    {product.status === "ACTIVE" ? "Actif" : product.status === "DRAFT" ? "Brouillon" : "Archivé"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${product.slug}`} className="p-1.5 text-stone hover:text-ivory transition-colors" title="Modifier">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <Link href={`/products/${product.slug}`} target="_blank" className="p-1.5 text-stone hover:text-ivory transition-colors" title="Voir">
                      {product.status === "ACTIVE" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-16 text-stone">
            <p>Aucun produit. <Link href="/admin/products/new" className="text-gold hover:text-gold-light">Créer le premier →</Link></p>
          </div>
        )}
      </div>
    </div>
  );
}
