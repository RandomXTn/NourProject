import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MapPin } from "lucide-react";

export default async function AddressesPage() {
  const session = await auth();
  if (!session) return null;

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="space-y-6">
      <h2 className="font-sans text-xs font-medium tracking-widest uppercase text-ivory">
        Mes adresses
      </h2>
      {addresses.length === 0 ? (
        <div className="text-center py-16 border border-border">
          <MapPin className="w-10 h-10 text-stone/30 mx-auto mb-4" />
          <p className="font-serif text-xl text-ivory">Aucune adresse enregistrée</p>
          <p className="text-sm text-stone mt-2">
            Vos adresses seront enregistrées automatiquement lors d&apos;une commande.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="border border-border p-5 space-y-1">
              {a.isDefault && <p className="text-2xs text-gold uppercase tracking-widest">Par défaut</p>}
              <p className="text-ivory text-sm">
                {a.firstName} {a.lastName}
              </p>
              <p className="text-xs text-stone">{a.street}</p>
              <p className="text-xs text-stone">
                {a.city}, {a.governorate}
              </p>
              <p className="text-xs text-stone">{a.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
