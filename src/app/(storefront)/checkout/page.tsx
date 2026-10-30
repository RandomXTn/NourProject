import type { Metadata } from "next";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Commander",
  description: "Finalisez votre commande NOUR.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-luxury max-w-6xl">
        <div className="text-center mb-10">
          <span className="font-serif text-3xl font-light tracking-[0.3em] text-ivory">NOUR</span>
          <h1 className="font-serif text-2xl font-light text-ivory mt-3">Commander</h1>
        </div>
        <CheckoutClient />
      </div>
    </div>
  );
}
