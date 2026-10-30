import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderConfirmationClient } from "./confirmation-client";

export const metadata: Metadata = { title: "Commande confirmée", robots: { index: false } };

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-stone">Chargement…</div>}>
        <OrderConfirmationClient />
      </Suspense>
    </div>
  );
}
