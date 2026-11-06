import type { Metadata } from "next";

import { BrandAssets } from "@/components/layout/brand-mark";
import { DashboardShell } from "@/components/dashboard/shell";
import { getSiteHome } from "@/lib/api";
import { SiteHomeProvider } from "@/lib/site-home-context";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const site = await getSiteHome();
  return (
    <SiteHomeProvider value={site}>
      <BrandAssets />
      <DashboardShell>{children}</DashboardShell>
    </SiteHomeProvider>
  );
}
