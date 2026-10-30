import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default async function AccountPage() {
  const session = await auth();
  if (!session) return null;

  const recentOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { items: { take: 1 } },
  });

  const statusLabel: Record<string, string> = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    PROCESSING: "En traitement",
    SHIPPED: "Expédiée",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
    REFUNDED: "Remboursée",
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Commandes", value: recentOrders.length, href: "/account/orders" },
          { label: "Favoris", value: "—", href: "/wishlist" },
          { label: "Adresses", value: "—", href: "/account/addresses" },
        ].map(({ label, value, href }) => (
          <Link key={label} href={href} className="border border-border p-5 hover:border-gold/50 transition-colors">
            <p className="text-2xl font-serif text-gold">{value}</p>
            <p className="text-xs text-stone tracking-widest uppercase mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {recentOrders.length > 0 && (
        <div>
          <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-ivory mb-4">Commandes récentes</h2>
          <div className="border border-border divide-y divide-border">
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-obsidian-50 transition-colors">
                <div>
                  <p className="text-sm text-ivory font-mono">{order.orderNumber}</p>
                  <p className="text-xs text-stone mt-0.5">{new Date(order.createdAt).toLocaleDateString("fr-TN")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gold">{formatPrice(order.totalMillimes)}</p>
                  <p className="text-xs text-stone mt-0.5">{statusLabel[order.status] ?? order.status}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/account/orders" className="text-xs text-gold hover:text-gold-light mt-3 inline-block">Voir toutes les commandes →</Link>
        </div>
      )}
    </div>
  );
}
