import type { Metadata } from "next";

import { ResetForm } from "@/components/forms/auth-forms";
import { ResetHeading } from "@/components/pages/auth-headings";

export const metadata: Metadata = { title: "Choose a new password" };

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ uid?: string; token?: string }>;
}) {
  const params = await searchParams;
  return (
    <>
      <ResetHeading />
      <div className="mt-8">
        <ResetForm uid={params.uid || ""} token={params.token || ""} />
      </div>
    </>
  );
}
