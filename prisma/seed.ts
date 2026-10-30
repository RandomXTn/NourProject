import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@nour.tn" },
    update: {},
    create: {
      email: "admin@nour.tn",
      name: "Admin NOUR",
      passwordHash: adminHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("✓ Admin user created (admin@nour.tn / admin123)");

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "jewelry" },
      update: {},
      create: { name: "Bijoux", nameFr: "Bijoux", slug: "jewelry", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "watches" },
      update: {},
      create: { name: "Montres", nameFr: "Montres", slug: "watches", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "bags" },
      update: {},
      create: { name: "Sacs", nameFr: "Sacs", slug: "bags", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "sunglasses" },
      update: {},
      create: { name: "Lunettes", nameFr: "Lunettes de soleil", slug: "sunglasses", isActive: true },
    }),
  ]);
  console.log("✓ Categories created");

  // Shipping zones
  await prisma.shippingZone.upsert({
    where: { id: "zone-tunis" },
    update: {},
    create: {
      id: "zone-tunis",
      name: "Grand Tunis",
      governorates: JSON.stringify(["Tunis", "Ariana", "Ben Arous", "La Manouba"]),
      feeMillimes: 7000,
      freeThreshold: 150000,
      isActive: true,
    },
  });

  await prisma.shippingZone.upsert({
    where: { id: "zone-other" },
    update: {},
    create: {
      id: "zone-other",
      name: "Autres régions",
      governorates: JSON.stringify(["Autres"]),
      feeMillimes: 10000,
      freeThreshold: 150000,
      isActive: true,
    },
  });
  console.log("✓ Shipping zones created");

  // Hero banner
  await prisma.heroBanner.upsert({
    where: { id: "hero-1" },
    update: {},
    create: {
      id: "hero-1",
      title: "L'Art de l'Élégance",
      subtitle: "Collection Exclusive 2024",
      cta1Label: "Découvrir",
      cta1Link: "/shop",
      imageUrl: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1920&q=80",
      isActive: true,
      sortOrder: 0,
    },
  });
  console.log("✓ Hero banner created");

  await prisma.announcement.upsert({
    where: { id: "ann-1" },
    update: {},
    create: {
      id: "ann-1",
      text: "Livraison gratuite pour toute commande supérieure à 150 DT — Code: NOUR150",
      isActive: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "NOUR150" },
    update: {},
    create: {
      code: "NOUR150",
      type: "FIXED",
      valueMillimes: 0,
      freeShipping: true,
      minOrderMillimes: 150000,
      isActive: true,
    },
  });
  console.log("✓ Coupon NOUR150 created");

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  const products = [
    {
      slug: "collier-diamant-eternel",
      name: "Collier Diamant Éternel",
      categoryId: bySlug.jewelry,
      priceMillimes: 285000,
      salePriceMillimes: null as number | null,
      isFeatured: true,
      isNewArrival: true,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    },
    {
      slug: "montre-prestige-or",
      name: "Montre Prestige Or",
      categoryId: bySlug.watches,
      priceMillimes: 890000,
      salePriceMillimes: 750000,
      isFeatured: true,
      isNewArrival: false,
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&q=80",
    },
    {
      slug: "sac-cuir-milano",
      name: "Sac Cuir Milano",
      categoryId: bySlug.bags,
      priceMillimes: 420000,
      salePriceMillimes: null,
      isFeatured: true,
      isNewArrival: true,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    },
    {
      slug: "lunettes-solaires-aviateur",
      name: "Lunettes Solaires Aviateur",
      categoryId: bySlug.sunglasses,
      priceMillimes: 195000,
      salePriceMillimes: null,
      isFeatured: true,
      isNewArrival: true,
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    },
    {
      slug: "bracelet-or-rose",
      name: "Bracelet Or Rose",
      categoryId: bySlug.jewelry,
      priceMillimes: 165000,
      salePriceMillimes: null,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    },
    {
      slug: "montre-automatique-noire",
      name: "Montre Automatique Noire",
      categoryId: bySlug.watches,
      priceMillimes: 650000,
      salePriceMillimes: null,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80",
    },
    {
      slug: "sac-main-velours",
      name: "Sac à Main Velours",
      categoryId: bySlug.bags,
      priceMillimes: 310000,
      salePriceMillimes: 260000,
      isFeatured: true,
      isNewArrival: true,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    },
    {
      slug: "boucles-oreilles-perles",
      name: "Boucles d'Oreilles Perles",
      categoryId: bySlug.jewelry,
      priceMillimes: 125000,
      salePriceMillimes: null,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        nameFr: p.name,
        slug: p.slug,
        priceMillimes: p.priceMillimes,
        salePriceMillimes: p.salePriceMillimes,
        categoryId: p.categoryId,
        status: "ACTIVE",
        isFeatured: p.isFeatured,
        isBestSeller: "isBestSeller" in p ? Boolean(p.isBestSeller) : false,
        isNewArrival: p.isNewArrival,
        shortDesc: "Pièce exclusive de la collection NOUR.",
        description: "Une création soignée, pensée pour durer. Livraison en Tunisie.",
        images: {
          create: [{ url: p.image, alt: p.name, isPrimary: true, sortOrder: 0 }],
        },
      },
    });
    await prisma.productVariant.upsert({
      where: { sku: `NR-${p.slug}` },
      update: {},
      create: {
        productId: product.id,
        name: "Taille",
        value: "Unique",
        sku: `NR-${p.slug}`,
        stockQty: 12,
        isActive: true,
      },
    });
  }
  console.log("✓ Products created");

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
