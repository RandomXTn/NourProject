"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartVariant {
  id: string;
  name: string;
  value: string;
  priceMillimes?: number | null;
}

export interface CartItemData {
  id: string; // productId + variantId key
  productId: string;
  variantId?: string | null;
  name: string;
  slug: string;
  imageUrl?: string | null;
  priceMillimes: number;
  variant?: CartVariant | null;
  qty: number;
  maxQty: number;
}

interface CartState {
  items: CartItemData[];
  isOpen: boolean;
  couponCode: string | null;
  discountMillimes: number;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  addItem: (item: Omit<CartItemData, "id">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;

  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
}

function makeId(productId: string, variantId?: string | null) {
  return variantId ? `${productId}_${variantId}` : productId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discountMillimes: 0,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (item) => {
        const id = makeId(item.productId, item.variantId);
        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id
                  ? { ...i, qty: Math.min(i.qty + item.qty, i.maxQty) }
                  : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...item, id }],
            isOpen: true,
          };
        });
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: Math.min(qty, i.maxQty) } : i
          ),
        }));
      },

      clearCart: () =>
        set({ items: [], couponCode: null, discountMillimes: 0 }),

      applyCoupon: (code, discount) =>
        set({ couponCode: code, discountMillimes: discount }),

      removeCoupon: () => set({ couponCode: null, discountMillimes: 0 }),
    }),
    {
      name: "nour-cart",
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountMillimes: state.discountMillimes,
      }),
    }
  )
);

export function cartSubtotal(items: CartItemData[]) {
  return items.reduce((sum, item) => sum + item.priceMillimes * item.qty, 0);
}

export function cartItemCount(items: CartItemData[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}
