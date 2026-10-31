import type { Metadata } from "next";

import { ContactContent } from "@/components/pages/contact-content";
import { getPrograms } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact VBADRAN about personal training, online coaching, or a program that fits your week.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const programs = await getPrograms();
  return <ContactContent programs={programs} />;
}
