import { HeroSection } from "@/components/home/hero-section";
import { CollectionsGrid } from "@/components/home/collections-grid";
import { FeaturedProducts } from "@/components/home/featured-products";
import { BrandStory } from "@/components/home/brand-story";
import { NewArrivals } from "@/components/home/new-arrivals";
import { Testimonials } from "@/components/home/testimonials";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { ShippingInfo } from "@/components/home/shipping-info";
import { prisma } from "@/lib/prisma";

async function getHomeData() {
  try {
    const [featured, newArrivals] = await Promise.all([
      prisma.product.findMany({
        where: { isFeatured: true, status: "ACTIVE" },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 2 },
          variants: { where: { isActive: true } },
        },
        orderBy: { sortOrder: "asc" },
        take: 8,
      }),
      prisma.product.findMany({
        where: { isNewArrival: true, status: "ACTIVE" },
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          variants: { where: { isActive: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
    ]);
    return { featured, newArrivals };
  } catch {
    return { featured: [], newArrivals: [] };
  }
}

export default async function HomePage() {
  const { featured, newArrivals } = await getHomeData();

  return (
    <>
      <HeroSection />
      <CollectionsGrid />
      <FeaturedProducts products={featured} />
      <BrandStory />
      <NewArrivals products={newArrivals} />
      <Testimonials />
      <NewsletterSection />
      <ShippingInfo />
    </>
  );
}
