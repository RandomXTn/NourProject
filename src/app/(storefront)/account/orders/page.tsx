import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-400",
  CONFIRMED: "text-blue-400",
  PROCESSING: "text-blue-400",
  SHIPPED: "text-purple-400",
  DELIVERED: "text-green-400",
  CANCELLED: "text-red-400",
  REFUNDED: "text-gray-400",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmée", PROCESSING: "En traitement",
  SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée", REFUNDED: "Remboursée",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { take: 3, select: { productName: true, qty: true, imageUrl: true } } },
  });

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 border border-border">
        <Package className="w-10 h-10 text-stone/30 mx-auto mb-4" />
        <p className="font-serif text-xl text-ivory">Aucune commande</p>
        <p className="text-sm text-stone mt-2">Vous n&apos;avez pas encore passé de commande.</p>
        <Link href="/shop" className="btn-gold btn-sm mt-6 inline-flex">Explorer la boutique</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-ivory">Toutes mes commandes</h2>
      {orders.map((order) => (
        <Link key={order.id} href={`/account/orders/${order.id}`} className="block border border-border hover:border-gold/40 transition-colors p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-ivory">{order.orderNumber}</p>
              <p className="text-xs text-stone mt-1">{new Date(order.createdAt).toLocaleDateString("fr-TN", { dateStyle: "long" })}</p>
              <p className="text-xs mt-2">{order.items.map(i => `${i.productName} ×${i.qty}`).join(", ")}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-gold font-serif">{formatPrice(order.totalMillimes)}</p>
              <p className={`text-xs mt-1 ${STATUS_COLORS[order.status] ?? "text-stone"}`}>{STATUS_LABELS[order.status] ?? order.status}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
