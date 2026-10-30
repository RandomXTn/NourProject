"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  Settings, LogOut, Megaphone, Image as ImageIcon, ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/customers", label: "Clients", icon: Users },
  { href: "/admin/coupons", label: "Promotions", icon: Tag },
  { href: "/admin/content", label: "Contenu", icon: ImageIcon },
  { href: "/admin/announcements", label: "Annonces", icon: Megaphone },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("flex flex-col bg-obsidian-50 border-r border-border transition-all duration-300", collapsed ? "w-16" : "w-56")}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-border">
        {!collapsed && (
          <Link href="/admin" className="font-serif text-xl tracking-[0.2em] text-ivory">NOUR</Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className={cn("p-1.5 text-stone hover:text-ivory transition-colors", collapsed && "mx-auto")}>
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>
      {!collapsed && <p className="px-4 py-2 text-2xs text-stone/50 tracking-widest uppercase">Admin</p>}

      <nav className="flex-1 py-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150",
                active ? "text-gold bg-gold/5 border-r-2 border-gold" : "text-stone hover:text-ivory hover:bg-obsidian-100",
                collapsed && "justify-center"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-2">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn("flex items-center gap-3 w-full px-4 py-3 text-sm text-stone hover:text-red-400 transition-colors rounded", collapsed && "justify-center")}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && "Déconnexion"}
        </button>
      </div>
    </aside>
  );
}
