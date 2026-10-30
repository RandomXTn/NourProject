import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte NOUR.",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-18 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span className="font-serif text-3xl font-light tracking-[0.3em] text-ivory">
            NOUR
          </span>
          <h1 className="font-serif text-2xl font-light text-ivory mt-4 mb-2">
            Connexion
          </h1>
          <p className="text-sm text-stone">
            Bienvenue. Connectez-vous pour accéder à votre compte.
          </p>
        </div>
        <Suspense fallback={<p className="text-center text-stone text-sm">Chargement…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
