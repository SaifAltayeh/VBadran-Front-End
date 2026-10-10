import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ResultDetail } from "@/components/pages/result-detail";
import { getTransformation } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getTransformation(slug);
  if (!item) return { title: "Result" };
  return {
    title: `${item.client_name} · ${item.duration_weeks} weeks`,
    description: item.result_summary,
    alternates: { canonical: `/transformations/${slug}` },
  };
}

export default async function TransformationPage({ params }: Props) {
  const { slug } = await params;
  const item = await getTransformation(slug);
  if (!item) notFound();
  return <ResultDetail item={item} />;
}
