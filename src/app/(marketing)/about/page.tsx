import type { Metadata } from "next";

import { AboutContent } from "@/components/pages/about-content";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the coach behind VBADRAN. Personal training and online coaching built around the person in front of the plan.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutContent />;
}
