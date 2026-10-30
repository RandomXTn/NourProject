import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const COLLECTIONS = [
  { label: "Bijoux", href: "/collections/jewelry" },
  { label: "Montres", href: "/collections/watches" },
  { label: "Sacs", href: "/collections/bags" },
  { label: "Lunettes de soleil", href: "/collections/sunglasses" },
  { label: "Nouveautés", href: "/collections/new-arrivals" },
  { label: "Meilleures ventes", href: "/collections/best-sellers" },
];

const HELP_LINKS = [
  { label: "FAQ", href: "/faq" },
  { label: "Livraison & Retours", href: "/shipping" },
  { label: "À propos de nous", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Politique de confidentialité", href: "/privacy" },
  { label: "Conditions générales", href: "/terms" },
  { label: "Politique des cookies", href: "/cookies" },
];

export function Footer() {
  return (
    <footer className="bg-obsidian border-t border-border mt-24">
      {/* Main Footer */}
      <div className="container-luxury py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl font-light tracking-[0.3em] text-ivory">
                NOUR
              </span>
            </Link>
            <p className="text-sm text-stone leading-relaxed max-w-xs">
              Une sélection exclusive de bijoux, montres, sacs et lunettes de
              soleil pour celles et ceux qui apprécient l&apos;excellence.
            </p>
            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="p-2 text-stone hover:text-gold transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 text-stone hover:text-gold transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@nour.tn"
                className="p-2 text-stone hover:text-gold transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="font-sans text-xs font-medium tracking-widest uppercase text-ivory mb-6">
              Collections
            </h3>
            <ul className="space-y-3">
              {COLLECTIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone hover:text-ivory transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-sans text-xs font-medium tracking-widest uppercase text-ivory mb-6">
              Aide & Informations
            </h3>
            <ul className="space-y-3">
              {HELP_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-stone hover:text-ivory transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-sans text-xs font-medium tracking-widest uppercase text-ivory mb-6">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-stone">
                <Phone className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                <span>+216 XX XXX XXX</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-stone">
                <Mail className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                <a
                  href="mailto:contact@nour.tn"
                  className="hover:text-ivory transition-colors"
                >
                  contact@nour.tn
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-stone">
                <MapPin className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                <span>Tunisie</span>
              </li>
            </ul>

            {/* Payment badges */}
            <div className="mt-8">
              <p className="text-xs text-stone/60 tracking-widest uppercase mb-3">
                Paiement sécurisé
              </p>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 border border-border text-xs text-stone rounded">
                  COD
                </div>
                <div className="px-3 py-1.5 border border-border text-xs text-stone rounded">
                  Konnect
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container-luxury py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone/60">
            © {new Date().getFullYear()} NOUR. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-stone/60 hover:text-stone transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
