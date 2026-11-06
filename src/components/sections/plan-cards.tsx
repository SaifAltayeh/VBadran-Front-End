"use client";

import { Check } from "lucide-react";
import Link from "next/link";

import { Reveal, RevealGroup, RevealItem } from "@/components/ui/primitives";
import { packageFeatureLabels } from "@/lib/constants/site";
import { useLang } from "@/lib/i18n";
import { pickLocale, formatDuration } from "@/lib/locale";
import { useSiteHome } from "@/lib/site-home-context";
import { cn, formatPrice } from "@/lib/utils";
import type { Package } from "@/types";

export function PlanCards({
  packages,
  heading,
  linkHref,
  linkLabel,
}: {
  packages: Package[];
  heading?: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  const { t, lang, arabic } = useLang();
  const site = useSiteHome();
  const items = packages;
  const title = heading ?? (site.sections.programs.heading[lang] || t.programsHeading);

  if (!items.length) return null;

  return (
    <div className="w-full text-center">
      {heading !== "" ? (
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 text-start sm:flex-row sm:items-end">
            <h2
              className={
                arabic
                  ? "font-arabic text-[clamp(26px,3.4vw,40px)] font-medium leading-[1.3] text-title"
                  : "font-display text-[clamp(28px,3.6vw,42px)] font-medium leading-[1.2] tracking-[-0.03em] text-title"
              }
            >
              {title}
            </h2>
            {linkHref && linkLabel ? (
              <Link href={linkHref} className={`shrink-0 text-sm text-subtitle hover:text-title ${arabic ? "font-arabic" : ""}`}>
                {linkLabel}
              </Link>
            ) : null}
          </div>
        </Reveal>
      ) : null}

      <RevealGroup className={`${heading === "" ? "" : "mt-10 "}grid w-full grid-cols-1 gap-5 md:grid-cols-3`}>
        {items.map((item) => {
          const name = pickLocale(item.name, item.name_ar, lang);
          const tagline = pickLocale(item.tagline, item.tagline_ar, lang);
          const description = pickLocale(item.description, item.description_ar, lang);
          const gym = item.gym ? pickLocale(item.gym.name, item.gym.name_ar, lang) : "";
          const duration = formatDuration(item.duration_weeks, t.weeks);
          const bullets = packageFeatureLabels.filter((row) => item.features[row.key]).map((row) => t.features[row.key]);
          const blurb = tagline || description;
          return (
            <RevealItem key={item.slug} className="min-w-0">
              <article className="flex h-full w-full flex-col rounded-[28px] bg-card p-5 text-left sm:p-6">
                {item.image ? (
                  <div className="mb-4 overflow-hidden rounded-[18px] bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.image_alt || name} className="h-auto w-full object-contain" />
                  </div>
                ) : null}
                {gym && gym !== name ? <p className="text-[12px] text-primary">{gym}</p> : null}
                <h3 className="text-[17px] font-medium tracking-[-0.01em] text-title">{name}</h3>
                {blurb ? (
                  <p className={`mt-3 text-[13.5px] leading-[1.45] text-subtitle ${arabic ? "font-arabic" : ""}`}>{blurb}</p>
                ) : null}
                <div className="mt-5 rounded-[22px] bg-background px-4 pb-4 pt-3.5">
                  {Number(item.price) > 0 ? (
                    <p className="text-[34px] font-medium leading-none tracking-[-0.04em] text-title">
                      {formatPrice(item.price, item.currency, lang)}
                    </p>
                  ) : null}
                  {duration ? <p className="mt-2 text-[12px] text-subtitle">{duration}</p> : null}
                  <Link
                    href={`/checkout/${item.slug}`}
                    className={cn(
                      "mt-3 flex h-11 w-full items-center justify-center rounded-full text-[13px] font-medium transition-colors",
                      arabic && "font-arabic",
                      "bg-primary text-on-primary hover:bg-[#6bb3dc]",
                    )}
                  >
                    {t.pricingPage.start}
                  </Link>
                </div>
                {bullets.length ? (
                  <ul className="mt-5 space-y-2.5">
                    {bullets.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-[13px] leading-5 text-subtitle">
                        <Check className="mt-[3px] h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.2} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </div>
  );
}
