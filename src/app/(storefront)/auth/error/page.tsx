import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Erreur de connexion",
  robots: { index: false },
};

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-18 px-4 text-center">
      <div className="max-w-md space-y-6">
        <h1 className="font-serif text-3xl font-light text-ivory">Erreur de connexion</h1>
        <p className="text-stone text-sm">
          La connexion a échoué. Vérifiez vos identifiants et réessayez.
        </p>
        <Link href="/auth/login" className="btn-gold inline-flex">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
