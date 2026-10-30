import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe NOUR.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-2xl py-16">
        <span className="gold-line mb-6" />
        <h1 className="font-serif text-5xl font-light text-ivory mt-4 mb-8">Contact</h1>
        <div className="space-y-4 text-stone">
          <p>Une question sur une commande, un produit ou une livraison ?</p>
          <p>
            Email :{" "}
            <a href="mailto:contact@nour.tn" className="text-gold hover:text-gold-light">
              contact@nour.tn
            </a>
          </p>
          <p>Téléphone : +216 XX XXX XXX</p>
          <p>Tunis, Tunisie</p>
        </div>
      </div>
    </div>
  );
}
