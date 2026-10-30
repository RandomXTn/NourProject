import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-18 px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="font-serif text-3xl font-light text-ivory">Mot de passe oublié</h1>
        <p className="text-stone text-sm leading-relaxed">
          La réinitialisation automatique n&apos;est pas encore activée. Contactez-nous
          à <a href="mailto:contact@nour.tn" className="text-gold hover:text-gold-light">contact@nour.tn</a>{" "}
          et nous vous aiderons à retrouver l&apos;accès à votre compte.
        </p>
        <Link href="/auth/login" className="btn-outline-gold inline-flex">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
