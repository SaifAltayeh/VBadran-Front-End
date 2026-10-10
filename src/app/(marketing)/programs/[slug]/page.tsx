import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProgramDetail } from "@/components/pages/program-detail";
import { getProgram } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) return { title: "Program" };
  return {
    title: program.title,
    description: program.short_description,
    alternates: { canonical: `/programs/${slug}` },
    openGraph: { images: [program.featured_image] },
  };
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params;
  const program = await getProgram(slug);
  if (!program) notFound();
  return <ProgramDetail program={program} />;
}
