import { BrandAssets } from "@/components/layout/brand-mark";
import { AuthChrome } from "@/components/layout/auth-chrome";
import { getSiteHome } from "@/lib/api";
import { SiteHomeProvider } from "@/lib/site-home-context";

export const metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteHome();
  return (
    <SiteHomeProvider value={site}>
      <BrandAssets />
      <AuthChrome>{children}</AuthChrome>
    </SiteHomeProvider>
  );
}
