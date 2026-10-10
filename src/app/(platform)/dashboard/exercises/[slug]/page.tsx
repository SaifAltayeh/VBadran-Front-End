import { ExerciseDetail } from "@/components/dashboard/views";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ExerciseDetail slug={slug} />;
}
