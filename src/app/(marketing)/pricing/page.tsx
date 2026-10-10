import type { Metadata } from "next";

import { PricingContent } from "@/components/pages/pricing-content";
import { getPackages } from "@/lib/api";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Compare VBADRAN coaching packages: Foundation, Progress, Transform, and Elite.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const packages = await getPackages();
  return <PricingContent packages={packages} />;
}
