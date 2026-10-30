import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury max-w-3xl py-16 space-y-4 text-stone leading-relaxed">
        <h1 className="font-serif text-4xl font-light text-ivory mb-6">Politique de confidentialité</h1>
        <p>
          NOUR collecte uniquement les données nécessaires à la gestion des commandes,
          du compte client et de la newsletter. Vos informations ne sont pas vendues
          à des tiers.
        </p>
        <p>Pour toute demande d&apos;accès ou de suppression, écrivez à contact@nour.tn.</p>
      </div>
    </div>
  );
}
