import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions générales" };

export default function TermsPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-3xl py-16 space-y-4 text-stone leading-relaxed">
        <h1 className="font-serif text-4xl font-light text-ivory mb-6">Conditions générales</h1>
        <p>
          En passant commande sur NOUR, vous acceptez nos conditions de vente :
          prix affichés en dinars tunisiens, paiement à la livraison ou en ligne,
          et confirmation de commande par nos équipes.
        </p>
      </div>
    </div>
  );
}
