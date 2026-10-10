"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Reveal, RevealGroup, RevealItem } from "@/components/ui/primitives";
import { packageFeatureLabels } from "@/lib/constants/site";
import { useLang } from "@/lib/i18n";
import { cn, ease, formatPrice } from "@/lib/utils";
import type { Package } from "@/types";

function pickTiers(packages: Package[]) {
  const bySlug = Object.fromEntries(packages.map((item) => [item.slug, item]));
  const left = bySlug.foundation ?? packages[0];
  const mid = packages.find((item) => item.is_highlighted) ?? bySlug.transform ?? packages[1];
  const right = bySlug.elite ?? packages[packages.length - 1];
  return [left, mid, right].filter((item, index, list): item is Package => Boolean(item) && list.findIndex((entry) => entry?.slug === item.slug) === index);
}

function monthlyOf(item: Package) {
  const months = Math.max(1, item.duration_weeks / 4);
  return Math.round(Number(item.price) / months);
}

function yearlyOf(item: Package) {
  return Math.round(monthlyOf(item) * 10);
}

export function PlanCards({ packages }: { packages: Package[] }) {
  const { t, arabic } = useLang();
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const tiers = useMemo(() => pickTiers(packages), [packages]);
  const blurbs = t.blurbs as Record<string, string>;
  const bulletsBySlug = t.bullets as Record<string, readonly string[]>;
  const bulletsFor = (item: Package) =>
    bulletsBySlug[item.slug] ??
    packageFeatureLabels.filter((row) => item.features[row.key]).map((row) => t.features[row.key]);

  if (!tiers.length) return null;

  return (
    <div className="mx-auto max-w-[980px] text-center">
      <Reveal>
        <h2 className={arabic ? "font-arabic text-[clamp(26px,3.4vw,40px)] font-medium leading-[1.3] text-black" : "font-display text-[clamp(28px,3.6vw,42px)] font-medium leading-[1.2] tracking-[-0.03em] text-black"}>
          {t.plansTitle}
        </h2>
      </Reveal>

      <Reveal delay={0.08}>
      <div className="mt-6 inline-flex items-center rounded-full bg-[#efefef] p-1">
        <button
          type="button"
          onClick={() => setCycle("monthly")}
          className={cn(
            "rounded-full px-[14px] py-[6px] text-[13px] font-medium transition-colors",
            arabic && "font-arabic",
            cycle === "monthly" ? "bg-white text-black shadow-sm" : "text-neutral-500",
          )}
          aria-pressed={cycle === "monthly"}
        >
          {t.payMonthly}
        </button>
        <button
          type="button"
          onClick={() => setCycle("yearly")}
          className={cn(
            "rounded-full px-[14px] py-[6px] text-[13px] font-medium transition-colors",
            arabic && "font-arabic",
            cycle === "yearly" ? "bg-white text-black shadow-sm" : "text-neutral-500",
          )}
          aria-pressed={cycle === "yearly"}
        >
          {t.payYearly}
          <span className="ml-1.5 inline-block h-[6px] w-[6px] -translate-y-[5px] rounded-full bg-primary" aria-hidden />
        </button>
      </div>
      </Reveal>

      <RevealGroup className="mt-10 grid items-stretch gap-4 lg:grid-cols-3">
        {tiers.map((item, index) => {
          const featured = Boolean(item.is_highlighted) || index === 1;
          const amount = cycle === "monthly" ? monthlyOf(item) : yearlyOf(item);
          const unit = cycle === "monthly" ? t.month : t.year;
          const cta = `${index === tiers.length - 1 ? t.get : t.start} ${item.name}`;

          return (
            <RevealItem key={item.slug}>
            <article
              className={cn(
                "flex h-full flex-col rounded-[28px] bg-[#f4f4f4] p-5 text-left transition-transform duration-500 hover:-translate-y-1.5 sm:p-6",
                featured
                  ? "z-10 pb-6 pt-7 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)] lg:px-7 lg:pb-7 lg:pt-8"
                  : "shadow-[0_12px_40px_-30px_rgba(0,0,0,0.2)]",
              )}
            >
              <h3 className="text-[17px] font-medium tracking-[-0.01em] text-black">{item.name}</h3>
              <p className={`mt-3 min-h-[48px] text-[13.5px] leading-[1.45] text-neutral-500 ${arabic ? "font-arabic" : ""}`}>
                {blurbs[item.slug] ?? item.tagline}
              </p>

              <div className="mt-5 rounded-[22px] bg-white px-4 pb-4 pt-3.5">
                <div className="flex items-end gap-1.5">
                  <motion.p
                    key={`${item.slug}-${amount}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="text-[34px] font-medium leading-none tracking-[-0.04em] text-black"
                  >
                    {formatPrice(amount, item.currency)}
                  </motion.p>
                  <p className="mb-[2px] text-left text-[10.5px] leading-[1.2] text-neutral-400">
                    USD /
                    <br />
                    {unit}
                  </p>
                </div>
                <Link
                  href={`/checkout/${item.slug}`}
                  className={cn(
                    "mt-3 flex h-11 w-full items-center justify-center rounded-full text-[13px] font-medium transition-colors",
                    arabic && "font-arabic",
                    featured
                      ? "bg-primary text-white hover:bg-[#1c3694]"
                      : "bg-[#ececec] text-neutral-800 hover:bg-[#e2e2e2]",
                  )}
                >
                  {cta}
                </Link>
              </div>

              <ul className="mt-5 space-y-2.5">
                {bulletsFor(item).map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-[13px] leading-5 text-neutral-500">
                    <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.2} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <p className="mt-10">
        <Link href="/pricing" className={`text-[13px] text-neutral-400 transition-colors hover:text-primary ${arabic ? "font-arabic" : ""}`}>
          {t.compare}
        </Link>
      </p>
    </div>
  );
}
