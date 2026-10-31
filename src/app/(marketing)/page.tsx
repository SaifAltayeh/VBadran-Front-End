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
import { SiteHomeProvider } from "@/lib/site-home-context";
import { getPackages, getPrograms, getSiteHome, getTestimonials, getTransformations } from "@/lib/api";

export const metadata: Metadata = {
  title: "Personal Training & Online Coaching",
  description: "VBADRAN builds personal training and online coaching around your goals, schedule, and progress.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [programs, testimonials, transformations, packages, site] = await Promise.all([
    getPrograms(),
    getTestimonials(),
    getTransformations(),
    getPackages(),
    getSiteHome(),
  ]);

  return (
    <SiteHomeProvider value={site}>
      {site.hero.visible ? <Hero /> : null}
      {site.about.visible ? <AboutUs /> : null}
      {site.sections.programs.visible ? <ProgramBand programs={programs} /> : null}
      {site.sections.process.visible ? <Process /> : null}
      {site.sections.transformations.visible ? <TransformationBand items={transformations} /> : null}
      {site.sections.testimonials.visible ? <Testimonials items={testimonials} /> : null}
      {site.sections.pricing.visible ? <PricingBand packages={packages} /> : null}
      {site.sections.why.visible ? <Why /> : null}
      {site.sections.faq.visible ? <FaqPreview /> : null}
      {site.sections.cta.visible ? <FinalCta /> : null}
    </SiteHomeProvider>
  );
}
