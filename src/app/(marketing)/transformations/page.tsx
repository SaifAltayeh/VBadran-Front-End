import type { Metadata } from "next";

import { ResultsContent } from "@/components/pages/results-content";
import { getTransformations } from "@/lib/api";

export const metadata: Metadata = {
  title: "Transformations",
  description: "Client results from Badran training packages.",
  alternates: { canonical: "/transformations" },
};

export default async function TransformationsPage() {
  const items = await getTransformations();
  return <ResultsContent items={items} />;
}
