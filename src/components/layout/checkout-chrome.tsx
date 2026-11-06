"use client";

import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { LanguageToggle, useLang } from "@/lib/i18n";

export function CheckoutChrome({ children }: { children: React.ReactNode }) {
  const { t, arabic } = useLang();

  return (
    <div className="min-h-screen">
      <header className="flex h-20 items-center justify-between border-b border-line px-5 md:px-10">
        <Link href="/">
          <BrandMark />
        </Link>
        <div className="flex items-center gap-4">
          <p className={`hidden text-muted sm:block ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.18em]"}`}>{t.secureCheckout}</p>
          <LanguageToggle />
        </div>
      </header>
      <main id="main" className="px-5 py-10 md:px-10">
        {children}
      </main>
    </div>
  );
}
