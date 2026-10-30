import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Créez votre compte NOUR.",
  robots: { index: false },
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-18 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span className="font-serif text-3xl font-light tracking-[0.3em] text-ivory">
            NOUR
          </span>
          <h1 className="font-serif text-2xl font-light text-ivory mt-4 mb-2">
            Créer un compte
          </h1>
          <p className="text-sm text-stone">
            Rejoignez NOUR pour une expérience exclusive.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
