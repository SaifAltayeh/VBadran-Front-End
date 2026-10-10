import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CheckoutForm } from "@/components/forms/checkout-form";
import { CheckoutHeading } from "@/components/pages/auth-headings";
import { findPackage, findProgram } from "@/data/catalog";
import { getPackages, getProgram } from "@/lib/api";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const program = (await getProgram(slug)) || findProgram(slug);
  const packages = await getPackages().catch(() => []);
  const pack = packages.find((item) => item.slug === slug) || findPackage(slug);

  if (pack) {
    return (
      <div className="mx-auto max-w-5xl">
        <CheckoutHeading />
        <div className="mt-8">
          <CheckoutForm slug={pack.slug} kind="package" title={pack.name} price={pack.price} currency={pack.currency} duration={pack.duration_weeks} />
        </div>
      </div>
    );
  }
  if (!program) notFound();
  return (
    <div className="mx-auto max-w-5xl">
      <CheckoutHeading />
      <div className="mt-8">
        <CheckoutForm slug={program.slug} kind="program" title={program.title} price={program.price} currency={program.currency} duration={program.duration_weeks} />
      </div>
    </div>
  );
}
