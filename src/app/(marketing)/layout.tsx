import type { Metadata } from "next";

import { BrandAssets } from "@/components/layout/brand-mark";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { getSiteHome } from "@/lib/api";
import { SiteHomeProvider } from "@/lib/site-home-context";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteHome();
  const og = site.site.ogImage;
  const name = site.site.brandName?.en || "Badran";
  return {
    icons: site.site.favicon ? { icon: site.site.favicon } : undefined,
    openGraph: {
      siteName: name,
      images: og ? [{ url: og, alt: name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      images: og ? [og] : undefined,
    },
  };
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteHome();
  return (
    <SiteHomeProvider value={site}>
      <BrandAssets />
      <SkipLink />
      <Header />
      <main id="main" className="min-w-0 flex-1 overflow-x-clip pt-[calc(4rem+env(safe-area-inset-top))] md:pt-20">
        {children}
      </main>
      <Footer />
    </SiteHomeProvider>
  );
}
