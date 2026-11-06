import type { Metadata } from "next";

import { ContactContent } from "@/components/pages/contact-content";
import { getPrograms } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Badran about training packages and workout plans.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const programs = await getPrograms();
  return <ContactContent programs={programs} />;
}
