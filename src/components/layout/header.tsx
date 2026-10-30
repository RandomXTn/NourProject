"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Accueil", href: "/" },
  {
    label: "Boutique",
    href: "/shop",
    children: [
      { label: "Tous les produits", href: "/shop" },
      { label: "Nouveautés", href: "/collections/new-arrivals" },
      { label: "Meilleures ventes", href: "/collections/best-sellers" },
    ],
  },
  { label: "Bijoux", href: "/collections/jewelry" },
  { label: "Montres", href: "/collections/watches" },
  { label: "Sacs", href: "/collections/bags" },
  { label: "Lunettes", href: "/collections/sunglasses" },
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const { items: cartItems, openCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { data: session } = useSession();

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-obsidian/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/30"
            : "bg-transparent"
        )}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 group"
              aria-label="NOUR — Retour à l'accueil"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <span className="font-serif text-3xl font-light tracking-[0.3em] text-ivory group-hover:text-gold transition-colors duration-300">
                  NOUR
                </span>
              </motion.div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
              {NAV_ITEMS.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() =>
                    item.children ? setActiveDropdown(item.label) : undefined
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 text-xs font-sans font-medium tracking-widest uppercase text-stone hover:text-ivory transition-colors duration-200",
                      "relative after:absolute after:bottom-[-2px] after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
                    )}
                  >
                    {item.label}
                    {item.children && (
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    )}
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 w-52 bg-obsidian-50 border border-border shadow-xl"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-5 py-3 text-xs tracking-widest uppercase text-stone hover:text-ivory hover:bg-obsidian-100 transition-colors duration-200"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-stone hover:text-ivory transition-colors duration-200 relative"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2.5 text-stone hover:text-ivory transition-colors duration-200 relative"
                aria-label={`Favoris (${wishlistCount})`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-obsidian text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href={session ? "/account" : "/auth/login"}
                className="p-2.5 text-stone hover:text-ivory transition-colors duration-200 hidden sm:block"
                aria-label={session ? "Mon compte" : "Connexion"}
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="p-2.5 text-stone hover:text-ivory transition-colors duration-200 relative"
                aria-label={`Panier (${cartCount} articles)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-4 h-4 bg-gold text-obsidian text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2.5 text-stone hover:text-ivory transition-colors duration-200 lg:hidden ml-1"
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {mobileOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-border bg-obsidian-50/95 backdrop-blur-md"
            >
              <div className="container-luxury py-4">
                <form
                  action="/search"
                  method="get"
                  className="flex items-center gap-3"
                >
                  <Search className="w-4 h-4 text-stone flex-shrink-0" />
                  <input
                    ref={searchRef}
                    type="search"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des produits…"
                    className="flex-1 bg-transparent text-ivory placeholder:text-stone text-sm outline-none py-1"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-stone hover:text-ivory transition-colors"
                    aria-label="Fermer la recherche"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-obsidian/80 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-obsidian border-r border-border overflow-y-auto lg:hidden"
              aria-label="Navigation mobile"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <span className="font-serif text-2xl font-light tracking-[0.3em] text-ivory">
                  NOUR
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-stone hover:text-ivory"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3.5 text-sm font-sans font-medium tracking-widest uppercase text-stone hover:text-ivory border-b border-border/50 transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="pl-4 space-y-1 mt-1 mb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2.5 text-xs tracking-widest uppercase text-stone/70 hover:text-gold transition-colors duration-200"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="px-6 py-6 border-t border-border mt-auto">
                <Link
                  href={session ? "/account" : "/auth/login"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-sm text-stone hover:text-ivory transition-colors"
                >
                  <User className="w-4 h-4" />
                  {session ? "Mon compte" : "Connexion / Inscription"}
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
