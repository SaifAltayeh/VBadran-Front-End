import type { Metadata } from "next";

import { ResultsContent } from "@/components/pages/results-content";
import { getTransformations } from "@/lib/api";

export const metadata: Metadata = {
  title: "Transformations",
  description: "Client results from VBADRAN online coaching and transformation programs.",
  alternates: { canonical: "/transformations" },
};

export default async function TransformationsPage() {
  const items = await getTransformations();
  return <ResultsContent items={items} />;
}
