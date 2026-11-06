import type { Metadata } from "next";

import {
  AboutUs,
  FaqPreview,
  FinalCta,
  Hero,
  Process,
  ProgramBand,
  Testimonials,
  TransformationBand,
  Why,
} from "@/components/sections/home";
import { SiteHomeProvider } from "@/lib/site-home-context";
import { getPackages, getSiteHome, getTestimonials, getTransformations } from "@/lib/api";

export const metadata: Metadata = {
  title: "Training packages",
  description: "Training packages, personal workout plans, and exercise videos from Badran.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [testimonials, transformations, catalog, site] = await Promise.all([
    getTestimonials(),
    getTransformations(),
    getPackages()
      .then((packages) => ({ packages, unavailable: false }))
      .catch(() => ({ packages: [], unavailable: true })),
    getSiteHome(),
  ]);

  return (
    <SiteHomeProvider value={site}>
      {site.hero.visible ? <Hero /> : null}
      {site.about.visible ? <AboutUs /> : null}
      {site.sections.programs.visible ? <ProgramBand packages={catalog.packages} unavailable={catalog.unavailable} /> : null}
      {site.sections.process.visible ? <Process /> : null}
      {site.sections.transformations.visible ? <TransformationBand items={transformations} /> : null}
      {site.sections.testimonials.visible ? <Testimonials items={testimonials} /> : null}
      {site.sections.why.visible ? <Why /> : null}
      {site.sections.faq.visible ? <FaqPreview /> : null}
      {site.sections.cta.visible ? <FinalCta /> : null}
    </SiteHomeProvider>
  );
}
