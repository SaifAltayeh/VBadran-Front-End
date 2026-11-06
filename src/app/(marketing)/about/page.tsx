import type { Metadata } from "next";

import { AboutContent } from "@/components/pages/about-content";

export const metadata: Metadata = {
  title: "About",
  description: "Meet Badran. Training packages, personal workout plans, and instructional exercise videos.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
