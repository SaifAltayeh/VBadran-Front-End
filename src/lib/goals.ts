import { loc } from "@/lib/i18n/portal-ar";

export const FITNESS_GOALS = [
  { value: "fat-loss", en: "Fat loss", ar: "خسارة دهون" },
  { value: "muscle", en: "Muscle", ar: "بناء عضل" },
  { value: "strength", en: "Strength", ar: "قوة" },
  { value: "general", en: "General fitness", ar: "لياقة عامة" },
] as const;

export function goalLabel(value?: string | null, lang: "en" | "ar" = "en") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const found = FITNESS_GOALS.find(
    (item) => item.value === raw || item.en.toLowerCase() === raw.toLowerCase() || item.ar === raw,
  );
  if (found) return lang === "ar" ? found.ar : found.en;
  return loc(lang === "ar", raw) || raw;
}
