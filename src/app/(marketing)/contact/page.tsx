import type { Metadata } from "next";

import { ContactContent } from "@/components/pages/contact-content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact VBADRAN about personal training, online coaching, or a program that fits your week.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactContent />;
}
