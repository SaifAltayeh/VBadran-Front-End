import type { Metadata } from "next";

import { ProgramsContent } from "@/components/pages/programs-content";
import { getPackages } from "@/lib/api";

export const metadata: Metadata = {
  title: "Programs",
  description: "Training packages and workout plans from Badran.",
  alternates: { canonical: "/programs" },
};

export default async function ProgramsPage() {
  const catalog = await getPackages()
    .then((packages) => ({ packages, unavailable: false }))
    .catch(() => ({ packages: [], unavailable: true }));
  return <ProgramsContent packages={catalog.packages} unavailable={catalog.unavailable} />;
}
