import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique des cookies" };

export default function CookiesPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-3xl py-16 space-y-4 text-stone leading-relaxed">
        <h1 className="font-serif text-4xl font-light text-ivory mb-6">Politique des cookies</h1>
        <p>
          Nous utilisons des cookies essentiels pour le panier, la session et
          le bon fonctionnement du site. Aucun cookie publicitaire tiers n&apos;est
          déposé sans votre accord.
        </p>
      </div>
    </div>
  );
}
