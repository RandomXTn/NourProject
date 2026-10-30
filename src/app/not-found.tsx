import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center bg-obsidian">
      <div className="space-y-6">
        <p className="text-gold text-xs tracking-[0.3em] uppercase">Erreur 404</p>
        <h1 className="font-serif text-4xl font-light text-ivory">Page introuvable</h1>
        <p className="text-stone text-sm">Cette page n&apos;existe pas ou a été déplacée.</p>
        <Link href="/" className="btn-gold inline-flex">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
