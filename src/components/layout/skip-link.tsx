"use client";

import { useLang } from "@/lib/i18n";

export function SkipLink() {
  const { t } = useLang();
  return (
    <a
      href="#main"
      className="absolute left-4 top-4 z-[70] -translate-y-24 bg-black px-4 py-2 text-sm text-white focus:translate-y-0"
    >
      {t.skip}
    </a>
  );
}
