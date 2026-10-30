import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function AccountOrderDetailPage({ params }: Params) {
  const session = await auth();
  if (!session) return null;
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: { items: true },
  });
  if (!order) notFound();

  const shipping = order.shippingSnapshot ? JSON.parse(order.shippingSnapshot) : null;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/account/orders" className="text-xs text-gold hover:text-gold-light">
          ← Mes commandes
        </Link>
        <h2 className="font-serif text-2xl font-light text-ivory mt-3">{order.orderNumber}</h2>
        <p className="text-xs text-stone mt-1">
          {new Date(order.createdAt).toLocaleDateString("fr-TN", { dateStyle: "long" })}
        </p>
      </div>

      <div className="border border-border divide-y divide-border">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between px-5 py-4 gap-4">
            <div>
              <p className="text-sm text-ivory">{item.productName}</p>
              {item.variantName && <p className="text-xs text-stone">{item.variantName}</p>}
              <p className="text-xs text-stone mt-1">×{item.qty}</p>
            </div>
            <p className="text-sm text-gold">{formatPrice(item.priceMillimes * item.qty)}</p>
          </div>
        ))}
      </div>

      <div className="border border-border p-5 space-y-2 text-sm">
        <div className="flex justify-between text-stone">
          <span>Sous-total</span>
          <span>{formatPrice(order.subtotalMillimes)}</span>
        </div>
        {order.discountMillimes > 0 && (
          <div className="flex justify-between text-stone">
            <span>Réduction</span>
            <span className="text-gold">-{formatPrice(order.discountMillimes)}</span>
          </div>
        )}
        <div className="flex justify-between text-stone">
          <span>Livraison</span>
          <span>{order.shippingMillimes === 0 ? "Gratuite" : formatPrice(order.shippingMillimes)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-2">
          <span className="text-ivory">Total</span>
          <span className="text-gold font-serif">{formatPrice(order.totalMillimes)}</span>
        </div>
      </div>

      {shipping && (
        <div className="border border-border p-5 text-sm text-stone space-y-1">
          <p className="text-xs tracking-widest uppercase text-ivory mb-2">Livraison</p>
          <p>
            {shipping.firstName} {shipping.lastName}
          </p>
          <p>{shipping.street}</p>
          <p>
            {shipping.city}, {shipping.governorate}
          </p>
        </div>
      )}
    </div>
  );
}
