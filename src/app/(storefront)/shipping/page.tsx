import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livraison & Retours",
  description: "Informations de livraison et de retours NOUR.",
};

export default function ShippingPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-3xl py-16 space-y-6 text-stone leading-relaxed">
        <span className="gold-line mb-6" />
        <h1 className="font-serif text-5xl font-light text-ivory mt-4 mb-8">Livraison & Retours</h1>
        <p>Livraison en 2–4 jours ouvrables partout en Tunisie.</p>
        <p>Frais de 7 à 10 DT selon la région. Gratuite dès 150 DT.</p>
        <p>Retours sous 14 jours. Contactez-nous à contact@nour.tn pour ouvrir un dossier.</p>
      </div>
    </div>
  );
}
