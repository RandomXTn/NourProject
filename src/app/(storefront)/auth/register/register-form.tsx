"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { registerSchema } from "@/lib/validations";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

type RegisterData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterData) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password, phone: data.phone }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast({ title: "Erreur", description: json.error ?? "Inscription échouée.", variant: "destructive" });
        return;
      }
      await signIn("credentials", { email: data.email, password: data.password, redirect: false });
      router.push("/account");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {[
        { id: "name", label: "Nom complet", type: "text", placeholder: "Votre nom", autoComplete: "name", field: "name" },
        { id: "email", label: "Adresse e-mail", type: "email", placeholder: "vous@exemple.com", autoComplete: "email", field: "email" },
        { id: "phone", label: "Téléphone (optionnel)", type: "tel", placeholder: "+216 XX XXX XXX", autoComplete: "tel", field: "phone" },
      ].map(({ id, label, type, placeholder, autoComplete, field }) => (
        <div key={id}>
          <label htmlFor={id} className="block text-xs font-medium tracking-widest uppercase text-stone mb-2">{label}</label>
          <input id={id} type={type} autoComplete={autoComplete} {...register(field as keyof RegisterData)} className="input-luxury w-full" placeholder={placeholder} />
          {errors[field as keyof RegisterData] && <p className="mt-1.5 text-xs text-red-400">{errors[field as keyof RegisterData]?.message}</p>}
        </div>
      ))}

      <div>
        <label htmlFor="password" className="block text-xs font-medium tracking-widest uppercase text-stone mb-2">Mot de passe</label>
        <div className="relative">
          <input id="password" type={showPw ? "text" : "password"} autoComplete="new-password" {...register("password")} className="input-luxury w-full pr-12" placeholder="Minimum 8 caractères" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-ivory" aria-label="Afficher/masquer">
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-medium tracking-widest uppercase text-stone mb-2">Confirmer le mot de passe</label>
        <input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} className="input-luxury w-full" placeholder="••••••••" />
        {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn-gold w-full justify-center">{loading ? "Inscription…" : "Créer mon compte"}</button>
      <p className="text-center text-sm text-stone">
        Déjà un compte ?{" "}
        <Link href="/auth/login" className="text-gold hover:text-gold-light transition-colors">Se connecter</Link>
      </p>
    </form>
  );
}
