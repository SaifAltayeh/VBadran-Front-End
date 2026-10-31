import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";
import { getSiteHome } from "@/lib/api";
import { SiteHomeProvider } from "@/lib/site-home-context";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteHome();
  return (
    <SiteHomeProvider value={site}>
      <SkipLink />
      <Header />
      <main id="main" className="min-w-0 flex-1 overflow-x-clip pt-[calc(4rem+env(safe-area-inset-top))] md:pt-20">
        {children}
      </main>
      <Footer />
    </SiteHomeProvider>
  );
}
