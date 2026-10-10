import type { Metadata } from "next";

import {
  AboutUs,
  FaqPreview,
  FinalCta,
  Hero,
  PricingBand,
  Process,
  ProgramBand,
  Testimonials,
  TransformationBand,
  Why,
} from "@/components/sections/home";
import { getPackages, getPrograms, getTestimonials, getTransformations } from "@/lib/api";

export const metadata: Metadata = {
  title: "Personal Training & Online Coaching",
  description: "VBADRAN builds personal training and online coaching around your goals, schedule, and progress.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [programs, testimonials, transformations, packages] = await Promise.all([
    getPrograms(),
    getTestimonials(),
    getTransformations(),
    getPackages(),
  ]);

  return (
    <>
      <Hero />
      <AboutUs />
      <ProgramBand programs={programs} />
      <Process />
      <TransformationBand items={transformations} />
      <Testimonials items={testimonials} />
      <PricingBand packages={packages} />
      <Why />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
