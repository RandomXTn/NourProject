import type { Metadata } from "next";
import { WishlistClient } from "./wishlist-client";

export const metadata: Metadata = {
  title: "Favoris",
  robots: { index: false },
};

export default function WishlistPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="container-luxury">
        <div className="py-12 text-center border-b border-border mb-10">
          <span className="gold-line mb-4" />
          <h1 className="font-serif text-5xl font-light text-ivory mt-4">Favoris</h1>
        </div>
        <WishlistClient />
      </div>
    </div>
  );
}
