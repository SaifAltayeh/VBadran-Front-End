"use client";

import { useLang } from "@/lib/i18n";

export default function MarketingError({ reset }: { error: Error; reset: () => void }) {
  const { t, arabic } = useLang();
  return (
    <div className="px-6 py-28">
      <h1 className={arabic ? "font-arabic text-4xl md:text-5xl" : "font-display text-5xl tracking-tight"}>{t.errorTitle}</h1>
      <p className={`mt-4 max-w-md text-neutral-700 ${arabic ? "font-arabic" : ""}`}>{t.errorLead}</p>
      <button
        type="button"
        onClick={reset}
        className={`mt-8 text-sm underline ${arabic ? "font-arabic" : "uppercase tracking-[0.16em]"}`}
      >
        {t.tryAgain}
      </button>
    </div>
  );
}
