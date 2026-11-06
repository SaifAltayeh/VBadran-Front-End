import type { Metadata } from "next";

import { LegalContent } from "@/components/pages/legal-content";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return <LegalContent kind="terms" />;
}
