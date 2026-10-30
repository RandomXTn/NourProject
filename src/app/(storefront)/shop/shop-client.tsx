"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";

type SortKey = "newest" | "price-asc" | "price-desc" | "featured";

interface Product {
  id: string;
  name: string;
  slug: string;
  priceMillimes: number;
  salePriceMillimes: number | null;
  isFeatured: boolean;
  createdAt: Date | string;
  images: Array<{ url: string; alt: string | null; isPrimary: boolean }>;
  variants: Array<{ id: string; name: string; value: string }>;
  category: { id: string; name: string; slug: string } | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ShopPageClientProps {
  products: Product[];
  categories: Category[];
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Plus récents" },
  { value: "featured", label: "En vedette" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
];

export function ShopPageClient({ products, categories }: ShopPageClientProps) {
  const [sort, setSort] = useState<SortKey>("newest");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceMax, setPriceMax] = useState<number>(Infinity);
  const [filterOpen, setFilterOpen] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);

  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.priceMillimes), 0),
    [products]
  );

  const filtered = useMemo(() => {
    let result = [...products];
    if (selectedCategory) {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }
    if (onSaleOnly) {
      result = result.filter((p) => p.salePriceMillimes !== null);
    }
    if (priceMax !== Infinity) {
      result = result.filter((p) => p.priceMillimes <= priceMax);
    }
    result.sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.priceMillimes - b.priceMillimes;
        case "price-desc": return b.priceMillimes - a.priceMillimes;
        case "featured": return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
    return result;
  }, [products, selectedCategory, onSaleOnly, priceMax, sort]);

  return (
    <div className="container-luxury pb-24">
      {/* Page Header */}
      <div className="py-12 text-center border-b border-border mb-10">
        <span className="gold-line mb-4" />
        <h1 className="font-serif text-5xl font-light text-ivory mt-4">
          Boutique
        </h1>
        <p className="text-stone text-sm mt-3">
          {filtered.length} produit{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters (desktop) */}
        <aside className="hidden lg:block w-56 flex-shrink-0 space-y-8">
          <FilterPanel
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSaleOnly={onSaleOnly}
            onSaleOnlyChange={setOnSaleOnly}
            maxPrice={maxPrice}
            priceMax={priceMax}
            onPriceMaxChange={setPriceMax}
            onClearAll={() => {
              setSelectedCategory(null);
              setOnSaleOnly(false);
              setPriceMax(Infinity);
            }}
          />
        </aside>

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-stone hover:text-ivory transition-colors border border-border px-4 py-2.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
            </button>

            {/* Sort */}
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-xs text-stone hidden sm:block tracking-wide">
                Trier par :
              </span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="appearance-none bg-obsidian-50 border border-border text-stone text-xs py-2.5 pl-3 pr-8 focus:outline-none focus:border-gold cursor-pointer"
                  aria-label="Trier les produits"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-stone pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-stone">
              <p className="font-serif text-2xl font-light text-ivory mb-3">
                Aucun produit trouvé
              </p>
              <p className="text-sm">
                Essayez de modifier vos filtres de recherche.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setOnSaleOnly(false);
                  setPriceMax(Infinity);
                }}
                className="mt-6 btn-outline-gold btn-sm"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.35 }}
            className="absolute top-0 left-0 bottom-0 w-80 bg-obsidian border-r border-border overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-border">
              <h2 className="text-sm font-medium tracking-widest uppercase text-ivory">
                Filtres
              </h2>
              <button onClick={() => setFilterOpen(false)}>
                <X className="w-5 h-5 text-stone" />
              </button>
            </div>
            <div className="p-5">
              <FilterPanel
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(c) => { setSelectedCategory(c); setFilterOpen(false); }}
                onSaleOnly={onSaleOnly}
                onSaleOnlyChange={setOnSaleOnly}
                maxPrice={maxPrice}
                priceMax={priceMax}
                onPriceMaxChange={setPriceMax}
                onClearAll={() => {
                  setSelectedCategory(null);
                  setOnSaleOnly(false);
                  setPriceMax(Infinity);
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

interface FilterPanelProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  onSaleOnly: boolean;
  onSaleOnlyChange: (v: boolean) => void;
  maxPrice: number;
  priceMax: number;
  onPriceMaxChange: (v: number) => void;
  onClearAll: () => void;
}

function FilterPanel({
  categories,
  selectedCategory,
  onCategoryChange,
  onSaleOnly,
  onSaleOnlyChange,
  onClearAll,
}: FilterPanelProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-medium tracking-widest uppercase text-ivory mb-4">
          Catégories
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onCategoryChange(null)}
              className={cn(
                "text-sm transition-colors duration-200 hover:text-ivory",
                selectedCategory === null ? "text-gold" : "text-stone"
              )}
            >
              Tous les produits
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() =>
                  onCategoryChange(
                    selectedCategory === cat.slug ? null : cat.slug
                  )
                }
                className={cn(
                  "text-sm transition-colors duration-200 hover:text-ivory",
                  selectedCategory === cat.slug ? "text-gold" : "text-stone"
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xs font-medium tracking-widest uppercase text-ivory mb-4">
          Offres
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={onSaleOnly}
            onChange={(e) => onSaleOnlyChange(e.target.checked)}
            className="rounded border-border bg-obsidian accent-gold"
          />
          <span className="text-sm text-stone hover:text-ivory transition-colors">
            En promotion uniquement
          </span>
        </label>
      </div>

      <button
        onClick={onClearAll}
        className="text-xs text-stone/60 hover:text-stone transition-colors tracking-wide"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
