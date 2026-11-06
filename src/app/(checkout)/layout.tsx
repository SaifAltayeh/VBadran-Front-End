import { BrandAssets } from "@/components/layout/brand-mark";
import { CheckoutChrome } from "@/components/layout/checkout-chrome";
import { getSiteHome } from "@/lib/api";
import { SiteHomeProvider } from "@/lib/site-home-context";

export const metadata = { robots: { index: false, follow: false } };

export const dynamic = "force-dynamic";

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteHome();
  return (
    <SiteHomeProvider value={site}>
      <BrandAssets />
      <CheckoutChrome>{children}</CheckoutChrome>
    </SiteHomeProvider>
  );
}
