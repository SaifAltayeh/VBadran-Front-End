import { WorkoutView } from "@/components/dashboard/views";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ slot?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  return <WorkoutView id={Number(id)} slot={query.slot} />;
}
