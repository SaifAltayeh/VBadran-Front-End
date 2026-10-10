import type { Metadata } from "next";

import { ProgramsContent } from "@/components/pages/programs-content";
import { getPrograms } from "@/lib/api";

export const metadata: Metadata = {
  title: "Programs",
  description: "Personal training, online coaching, transformation, nutrition, and sports programs from VBADRAN.",
  alternates: { canonical: "/programs" },
};

export default async function ProgramsPage() {
  const programs = await getPrograms();
  return <ProgramsContent programs={programs} />;
}
