"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema } from "@/lib/validations";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";

type LoginData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginData) {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast({
          title: "Identifiants incorrects",
          description: "Vérifiez votre email et mot de passe.",
          variant: "destructive",
        });
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="block text-xs font-medium tracking-widest uppercase text-stone mb-2">
          Adresse e-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="input-luxury w-full"
          placeholder="vous@exemple.com"
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="password" className="block text-xs font-medium tracking-widest uppercase text-stone">
            Mot de passe
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-gold/70 hover:text-gold transition-colors"
          >
            Mot de passe oublié ?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            {...register("password")}
            className="input-luxury w-full pr-12"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone hover:text-ivory transition-colors"
            aria-label={showPw ? "Masquer" : "Afficher"}
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full justify-center"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>

      <p className="text-center text-sm text-stone">
        Pas encore de compte ?{" "}
        <Link
          href="/auth/register"
          className="text-gold hover:text-gold-light transition-colors"
        >
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
}
