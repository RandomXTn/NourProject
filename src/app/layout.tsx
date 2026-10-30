import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000"
  ),
  title: {
    default: "NOUR — Bijoux & Accessoires de Luxe | Tunisie",
    template: "%s | NOUR",
  },
  description:
    "Découvrez la collection exclusive NOUR : bijoux, montres, sacs et lunettes de soleil de luxe. Livraison en Tunisie.",
  keywords: [
    "bijoux",
    "montres",
    "sacs",
    "lunettes de soleil",
    "luxe",
    "Tunisie",
    "accessoires",
    "NOUR",
  ],
  openGraph: {
    type: "website",
    locale: "fr_TN",
    siteName: "NOUR",
    title: "NOUR — Bijoux & Accessoires de Luxe | Tunisie",
    description:
      "Découvrez la collection exclusive NOUR : bijoux, montres, sacs et lunettes de soleil de luxe.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NOUR — Bijoux & Accessoires de Luxe | Tunisie",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090909",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
