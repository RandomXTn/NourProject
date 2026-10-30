import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-400/10 text-yellow-400", CONFIRMED: "bg-blue-400/10 text-blue-400",
  PROCESSING: "bg-blue-400/10 text-blue-400", SHIPPED: "bg-purple-400/10 text-purple-400",
  DELIVERED: "bg-green-400/10 text-green-400", CANCELLED: "bg-red-400/10 text-red-400",
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente", CONFIRMED: "Confirmée", PROCESSING: "Traitement",
  SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée",
};
const PAY_LABELS: Record<string, string> = {
  PENDING: "Non payé", PAID: "Payé", FAILED: "Échoué",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { productName: true }, take: 1 },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-light text-ivory">Commandes</h1>
      <div className="border border-border overflow-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              {["N° Commande", "Client", "Date", "Montant", "Paiement", "Statut", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-2xs tracking-widest uppercase text-stone font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-obsidian-50 transition-colors">
                <td className="px-4 py-3 font-mono text-ivory">{order.orderNumber}</td>
                <td className="px-4 py-3 text-stone">{order.user?.name ?? order.guestEmail ?? "Invité"}</td>
                <td className="px-4 py-3 text-stone whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString("fr-TN")}</td>
                <td className="px-4 py-3 text-gold">{formatPrice(order.totalMillimes)}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${order.paymentStatus === "PAID" ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                    {PAY_LABELS[order.paymentStatus] ?? order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-stone/10 text-stone"}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.orderNumber}`} className="text-xs text-gold hover:text-gold-light">Voir →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="text-center py-12 text-stone">Aucune commande.</p>}
      </div>
    </div>
  );
}
