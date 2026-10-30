"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";

interface Banner { id: string; title: string; subtitle: string | null; cta1Label: string | null; cta1Link: string | null; imageUrl: string | null; isActive: boolean; }
interface Announcement { id: string; text: string; isActive: boolean; }

export function ContentManager({ banners, announcements }: { banners: Banner[]; announcements: Announcement[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"banners" | "announcements">("banners");
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [saving, setSaving] = useState(false);

  async function createAnnouncement() {
    if (!newAnnouncement.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newAnnouncement }),
    });
    setSaving(false);
    if (res.ok) { toast({ title: "Annonce créée", variant: "success" }); setNewAnnouncement(""); router.refresh(); }
  }

  async function deleteAnnouncement(id: string) {
    const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    if (res.ok) { toast({ title: "Annonce supprimée" }); router.refresh(); }
  }

  async function toggleAnnouncement(id: string, current: boolean) {
    const res = await fetch(`/api/admin/announcements/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    if (res.ok) { router.refresh(); }
  }

  return (
    <div>
      <div className="flex gap-1 border-b border-border mb-6">
        {(["banners", "announcements"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs tracking-widest uppercase border-b-2 transition-colors ${tab === t ? "border-gold text-gold" : "border-transparent text-stone hover:text-ivory"}`}>
            {t === "banners" ? "Bannières Hero" : "Annonces"}
          </button>
        ))}
      </div>

      {tab === "banners" && (
        <div className="space-y-4">
          <p className="text-sm text-stone">Les bannières hero s&apos;affichent sur la page d&apos;accueil.</p>
          {banners.map((b) => (
            <div key={b.id} className="border border-border p-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-ivory font-medium">{b.title}</p>
                {b.subtitle && <p className="text-xs text-stone mt-1">{b.subtitle}</p>}
                {b.imageUrl && <p className="text-2xs text-stone/50 mt-1 font-mono truncate max-w-xs">{b.imageUrl}</p>}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${b.isActive ? "bg-green-400/10 text-green-400" : "bg-stone/10 text-stone"}`}>
                {b.isActive ? "Actif" : "Inactif"}
              </span>
            </div>
          ))}
          <p className="text-xs text-stone/50">Les bannières hero peuvent être gérées via la base de données ou un éditeur dédié (extension future).</p>
        </div>
      )}

      {tab === "announcements" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              className="input-luxury flex-1"
              placeholder="Texte de l'annonce (barre en haut du site)"
            />
            <button onClick={createAnnouncement} disabled={saving} className="btn-gold btn-sm flex items-center gap-1">
              <Plus className="w-4 h-4" />{saving ? "…" : "Ajouter"}
            </button>
          </div>
          <div className="border border-border divide-y divide-border">
            {announcements.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3 gap-4">
                <p className="text-sm text-ivory flex-1">{a.text}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleAnnouncement(a.id, a.isActive)} className={`text-xs ${a.isActive ? "text-green-400" : "text-stone"} hover:opacity-80`}>
                    {a.isActive ? "Actif" : "Inactif"}
                  </button>
                  <button onClick={() => deleteAnnouncement(a.id)} className="text-red-400/60 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {announcements.length === 0 && <p className="text-sm text-stone text-center py-8">Aucune annonce.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
