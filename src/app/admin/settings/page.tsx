import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSetting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  const zones = await prisma.shippingZone.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="font-serif text-3xl font-light text-ivory">Paramètres</h1>
      <SettingsForm settings={settingsMap} zones={zones} />
    </div>
  );
}
