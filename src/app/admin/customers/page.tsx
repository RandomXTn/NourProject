import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER", deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, phone: true, createdAt: true, _count: { select: { orders: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-light text-ivory">Clients ({customers.length})</h1>
      <div className="border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Nom", "Email", "Téléphone", "Commandes", "Inscrit le"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-2xs tracking-widest uppercase text-stone font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-obsidian-50 transition-colors">
                <td className="px-4 py-3 text-ivory">{c.name ?? "—"}</td>
                <td className="px-4 py-3 text-stone">{c.email}</td>
                <td className="px-4 py-3 text-stone">{c.phone ?? "—"}</td>
                <td className="px-4 py-3 text-gold">{c._count.orders}</td>
                <td className="px-4 py-3 text-stone whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString("fr-TN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <p className="text-center py-12 text-stone">Aucun client.</p>}
      </div>
    </div>
  );
}
