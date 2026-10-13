import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SkipLink } from "@/components/layout/skip-link";

export const dynamic = "force-dynamic";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" className="min-w-0 flex-1 pt-[calc(4rem+env(safe-area-inset-top))] md:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
