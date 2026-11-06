import type { Metadata } from "next";
import Link from "next/link";

import { CheckoutForm } from "@/components/forms/checkout-form";
import { CheckoutHeading } from "@/components/pages/auth-headings";
import { getGyms, getPackage, getProgram } from "@/lib/api";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [pack, program, gyms] = await Promise.all([getPackage(slug), getProgram(slug), getGyms()]);

  if (pack) {
    return (
      <div className="mx-auto max-w-5xl">
        <CheckoutHeading />
        <div className="mt-8">
          <CheckoutForm
            slug={pack.slug}
            kind="package"
            title={pack.name}
            titleAr={pack.name_ar}
            price={pack.price}
            currency={pack.currency}
            duration={pack.duration_weeks}
            image={pack.image}
            gym={pack.gym}
            gyms={gyms}
          />
        </div>
      </div>
    );
  }

  if (program) {
    return (
      <div className="mx-auto max-w-5xl">
        <CheckoutHeading />
        <div className="mt-8">
          <CheckoutForm
            slug={program.slug}
            kind="program"
            title={program.title}
            titleAr={program.title_ar}
            price={program.price}
            currency={program.currency}
            duration={program.duration_weeks}
            gyms={gyms}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl py-16">
      <h1 className="font-display text-4xl tracking-tight">This package is not available.</h1>
      <p className="mt-4 font-arabic text-xl">هذه الباقة غير متاحة.</p>
      <p className="mt-4 text-subtitle">It may be inactive or removed from sale. Existing purchases are not affected.</p>
      <Link href="/programs" className="mt-8 inline-flex rounded-full bg-primary px-5 py-3 text-sm text-on-primary">
        View available packages
      </Link>
    </div>
  );
}
