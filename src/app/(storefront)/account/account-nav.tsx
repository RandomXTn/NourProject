"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { User, ShoppingBag, Heart, MapPin, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/account", label: "Tableau de bord", icon: User },
  { href: "/account/orders", label: "Mes commandes", icon: ShoppingBag },
  { href: "/account/addresses", label: "Adresses", icon: MapPin },
  { href: "/wishlist", label: "Favoris", icon: Heart },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <aside className="lg:col-span-1">
      <nav className="border border-border">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-5 py-4 text-sm border-b border-border last:border-b-0 transition-colors duration-200",
              pathname === href ? "text-gold bg-gold/5" : "text-stone hover:text-ivory hover:bg-obsidian-50"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full items-center gap-3 px-5 py-4 text-sm text-stone hover:text-red-400 transition-colors border-t border-border"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </nav>
    </aside>
  );
}
