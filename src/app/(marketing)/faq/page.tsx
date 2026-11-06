import type { Metadata } from "next";

import { FaqPanel } from "@/components/sections/faq-panel";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Badran training packages, workout plans, and exercise videos.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="pt-4">
      <FaqPanel />
    </div>
  );
}
