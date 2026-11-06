import { loc } from "@/lib/i18n/portal-ar";

export function pickLocale(en?: string | null, ar?: string | null, lang: "en" | "ar" = "en") {
  const english = String(en || "").trim();
  const arabic = String(ar || "").trim();
  if (lang === "ar") return arabic || english;
  return english || arabic;
}

export function localized(lang: "en" | "ar", en?: string | null, ar?: string | null) {
  const picked = pickLocale(en, ar, lang);
  if (lang !== "ar") return picked;
  return loc(true, picked) || loc(true, en) || picked;
}

export function formatDuration(weeks: number | null | undefined, weeksLabel: string) {
  if (weeks === null || weeks === undefined || Number(weeks) <= 0) return "";
  return `${weeks} ${weeksLabel}`;
}
