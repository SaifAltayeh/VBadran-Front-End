import type { Metadata } from "next";

import { FaqPanel } from "@/components/sections/faq-panel";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about VBADRAN programs, nutrition, online coaching, and what happens after you join.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="pt-4">
      <FaqPanel />
    </div>
  );
}
