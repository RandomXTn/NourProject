import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Questions fréquentes — NOUR.",
};

const FAQS = [
  {
    q: "Quels sont les délais de livraison ?",
    a: "La livraison se fait en 2 à 4 jours ouvrables dans toute la Tunisie.",
  },
  {
    q: "La livraison est-elle gratuite ?",
    a: "Oui, dès 150 DT d'achat. En dessous, des frais de livraison s'appliquent selon la zone.",
  },
  {
    q: "Quels modes de paiement acceptez-vous ?",
    a: "Paiement à la livraison (espèces) et paiement en ligne via Konnect.",
  },
  {
    q: "Puis-je retourner un article ?",
    a: "Les retours sont acceptés sous 14 jours, article non porté, dans son emballage d'origine.",
  },
];

export default function FaqPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-3xl py-16">
        <span className="gold-line mb-6" />
        <h1 className="font-serif text-5xl font-light text-ivory mt-4 mb-10">FAQ</h1>
        <div className="space-y-8">
          {FAQS.map((item) => (
            <div key={item.q} className="border-b border-border pb-6">
              <h2 className="text-ivory font-medium mb-2">{item.q}</h2>
              <p className="text-stone text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
