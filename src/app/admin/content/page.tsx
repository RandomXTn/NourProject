import { prisma } from "@/lib/prisma";
import { ContentManager } from "./content-manager";

export default async function AdminContentPage() {
  const [banners, announcements] = await Promise.all([
    prisma.heroBanner.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.announcement.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="font-serif text-3xl font-light text-ivory">Gestion du contenu</h1>
      <ContentManager banners={banners} announcements={announcements} />
    </div>
  );
}
