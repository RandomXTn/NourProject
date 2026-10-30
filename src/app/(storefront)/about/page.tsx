import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description: "L'histoire de NOUR — bijoux et accessoires de luxe en Tunisie.",
};

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-3xl py-16">
        <span className="gold-line mb-6" />
        <h1 className="font-serif text-5xl font-light text-ivory mt-4 mb-8">À propos de NOUR</h1>
        <div className="space-y-6 text-stone leading-relaxed">
          <p>
            NOUR est une maison tunisienne dédiée à l&apos;élégance. Nous sélectionnons
            bijoux, montres, sacs et lunettes pour celles et ceux qui exigent
            des pièces raffinées, durables et distinctives.
          </p>
          <p>
            Chaque article est choisi pour sa matière, son dessin et sa présence.
            Notre promesse : une expérience d&apos;achat soignée, une livraison
            soigneuse dans toute la Tunisie, et un service attentif.
          </p>
        </div>
      </div>
    </div>
  );
}
