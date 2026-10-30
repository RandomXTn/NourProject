import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderStatusUpdater } from "./status-updater";

interface Params { params: Promise<{ orderNumber: string }> }

export default async function AdminOrderDetailPage({ params }: Params) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: true,
      address: true,
    },
  });
  if (!order) notFound();

  const shipping = order.shippingSnapshot ? JSON.parse(order.shippingSnapshot) : order.address;

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-light text-ivory">Commande {order.orderNumber}</h1>
          <p className="text-stone text-sm mt-1">{new Date(order.createdAt).toLocaleDateString("fr-TN", { dateStyle: "full" })}</p>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} currentPayment={order.paymentStatus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="border border-border p-5 space-y-2">
          <h2 className="text-xs font-medium tracking-widest uppercase text-ivory mb-3">Client</h2>
          <p className="text-sm text-ivory">{order.user?.name ?? "Invité"}</p>
          <p className="text-xs text-stone">{order.user?.email ?? order.guestEmail}</p>
          <p className="text-xs text-stone">{order.user?.phone ?? order.guestPhone}</p>
        </div>

        {/* Shipping */}
        <div className="border border-border p-5 space-y-2">
          <h2 className="text-xs font-medium tracking-widest uppercase text-ivory mb-3">Livraison</h2>
          {shipping ? (
            <>
              <p className="text-sm text-ivory">{shipping.firstName} {shipping.lastName}</p>
              <p className="text-xs text-stone">{shipping.street}</p>
              <p className="text-xs text-stone">{shipping.city}, {shipping.governorate}</p>
              <p className="text-xs text-stone">{shipping.phone}</p>
              {shipping.notes && <p className="text-xs text-stone/60 italic">{shipping.notes}</p>}
            </>
          ) : <p className="text-sm text-stone">Adresse non disponible</p>}
        </div>
      </div>

      {/* Items */}
      <div className="border border-border">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-xs font-medium tracking-widest uppercase text-ivory">Articles commandés</h2>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                {item.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt={item.productName} className="w-12 h-14 object-cover bg-obsidian-100" />
                )}
                <div>
                  <p className="text-sm text-ivory">{item.productName}</p>
                  {item.variantName && <p className="text-xs text-stone">{item.variantName}</p>}
                  {item.sku && <p className="text-2xs font-mono text-stone/60">{item.sku}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-ivory">×{item.qty}</p>
                <p className="text-sm text-gold">{formatPrice(item.priceMillimes * item.qty)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-border space-y-1.5">
          <div className="flex justify-between text-sm text-stone"><span>Sous-total</span><span>{formatPrice(order.subtotalMillimes)}</span></div>
          {order.discountMillimes > 0 && <div className="flex justify-between text-sm text-stone"><span>Remise{order.couponCode ? ` (${order.couponCode})` : ""}</span><span className="text-gold">-{formatPrice(order.discountMillimes)}</span></div>}
          <div className="flex justify-between text-sm text-stone"><span>Livraison</span><span>{order.shippingMillimes === 0 ? "Gratuite" : formatPrice(order.shippingMillimes)}</span></div>
          <div className="flex justify-between font-medium border-t border-border pt-2 mt-2">
            <span className="text-xs tracking-widest uppercase text-ivory">Total</span>
            <span className="font-serif text-gold">{formatPrice(order.totalMillimes)}</span>
          </div>
        </div>
      </div>

      {/* Payment info */}
      <div className="border border-border p-5 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-2xs tracking-widest uppercase text-stone mb-1">Méthode de paiement</p>
          <p className="text-ivory">{order.paymentMethod === "CASH_ON_DELIVERY" ? "À la livraison" : order.paymentMethod}</p>
        </div>
        <div>
          <p className="text-2xs tracking-widest uppercase text-stone mb-1">Statut paiement</p>
          <p className={order.paymentStatus === "PAID" ? "text-green-400" : "text-yellow-400"}>
            {order.paymentStatus === "PAID" ? "Payé" : order.paymentStatus === "PENDING" ? "En attente" : order.paymentStatus}
          </p>
        </div>
        {order.trackingNumber && (
          <div className="col-span-2">
            <p className="text-2xs tracking-widest uppercase text-stone mb-1">Numéro de suivi</p>
            <p className="text-ivory font-mono">{order.trackingNumber}</p>
          </div>
        )}
      </div>
    </div>
  );
}
