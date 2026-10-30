import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Users, Package, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

async function getDashboardStats() {
  const [totalOrders, totalRevenue, totalCustomers, totalProducts, recentOrders, lowStock] = await Promise.all([
    prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
    prisma.order.aggregate({ where: { paymentStatus: "PAID" }, _sum: { totalMillimes: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { orderNumber: true, totalMillimes: true, status: true, createdAt: true, guestEmail: true, userId: true, user: { select: { name: true, email: true } } },
    }),
    prisma.productVariant.findMany({
      where: { stockQty: { lte: 3 } },
      include: { product: { select: { name: true, slug: true } } },
      take: 5,
    }),
  ]);
  return { totalOrders, totalRevenue: totalRevenue._sum.totalMillimes ?? 0, totalCustomers, totalProducts, recentOrders, lowStock };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-400/10 text-yellow-400",
  CONFIRMED: "bg-blue-400/10 text-blue-400",
  PROCESSING: "bg-blue-400/10 text-blue-400",
  SHIPPED: "bg-purple-400/10 text-purple-400",
  DELIVERED: "bg-green-400/10 text-green-400",
  CANCELLED: "bg-red-400/10 text-red-400",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmée", PROCESSING: "Traitement",
  SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée",
};

export default async function AdminDashboard() {
  const { totalOrders, totalRevenue, totalCustomers, totalProducts, recentOrders, lowStock } = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light text-ivory">Tableau de bord</h1>
        <p className="text-stone text-sm mt-1">{new Date().toLocaleDateString("fr-TN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Commandes", value: totalOrders, icon: ShoppingCart, href: "/admin/orders", color: "text-blue-400" },
          { label: "Chiffre d'affaires", value: formatPrice(totalRevenue), icon: TrendingUp, href: "/admin/orders", color: "text-gold" },
          { label: "Clients", value: totalCustomers, icon: Users, href: "/admin/customers", color: "text-green-400" },
          { label: "Produits actifs", value: totalProducts, icon: Package, href: "/admin/products", color: "text-purple-400" },
        ].map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="border border-border p-5 hover:border-gold/40 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-stone tracking-widest uppercase">{label}</p>
                <p className={`text-2xl font-serif mt-2 ${color}`}>{value}</p>
              </div>
              <Icon className={`w-5 h-5 ${color} opacity-60`} />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-xs font-medium tracking-widest uppercase text-ivory">Commandes récentes</h2>
            <Link href="/admin/orders" className="text-xs text-gold hover:text-gold-light">Voir tout →</Link>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <Link key={order.orderNumber} href={`/admin/orders/${order.orderNumber}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-obsidian-50 transition-colors">
                <div>
                  <p className="text-sm font-mono text-ivory">{order.orderNumber}</p>
                  <p className="text-xs text-stone mt-0.5">{order.user?.name ?? order.guestEmail ?? "Invité"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gold">{formatPrice(order.totalMillimes)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-stone/10 text-stone"}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="border border-border">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <h2 className="text-xs font-medium tracking-widest uppercase text-ivory">Stock bas</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="px-5 py-8 text-sm text-stone text-center">Aucune alerte de stock</p>
          ) : (
            <div className="divide-y divide-border">
              {lowStock.map((v) => (
                <Link key={v.id} href={`/admin/products/${v.product.slug}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-obsidian-50 transition-colors">
                  <div>
                    <p className="text-xs text-ivory truncate max-w-[140px]">{v.product.name}</p>
                    <p className="text-2xs text-stone mt-0.5">{v.name}: {v.value}</p>
                  </div>
                  <span className={`text-xs font-medium ${v.stockQty === 0 ? "text-red-400" : "text-yellow-400"}`}>
                    {v.stockQty === 0 ? "Épuisé" : `${v.stockQty} restant`}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
