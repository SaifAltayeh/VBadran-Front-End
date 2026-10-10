"use client";

import { useState } from "react";

import { Button, Container, Reveal } from "@/components/ui/primitives";
import { packageFeatureLabels } from "@/lib/constants/site";
import { useLang } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import type { Package } from "@/types";

export function PricingContent({ packages }: { packages: Package[] }) {
  const { t, arabic } = useLang();
  const copy = t.pricingPage;
  const [selected, setSelected] = useState(
    () => packages.find((item) => item.is_highlighted)?.slug ?? packages[0]?.slug ?? "",
  );

  return (
    <>
      <section className="pb-8 pt-12 md:pb-10 md:pt-16">
        <Container>
          <Reveal>
            <p className={arabic ? "font-arabic text-[15px] text-primary" : "text-[11px] uppercase tracking-[0.22em] text-primary"}>
              {copy.kicker}
            </p>
            <h1
              className={
                arabic
                  ? "mt-4 max-w-[14ch] font-arabic text-[clamp(32px,9vw,68px)] font-extrabold leading-[1.15]"
                  : "mt-4 max-w-[12ch] font-display text-[clamp(34px,10vw,76px)] font-medium leading-[0.9] tracking-[-0.045em]"
              }
            >
              {copy.title}
            </h1>
            <p className={`mt-5 max-w-md text-base leading-7 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{copy.lead}</p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-16 md:pb-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {packages.map((item) => {
              const included = packageFeatureLabels.filter((row) => item.features[row.key]);
              const on = item.slug === selected;
              return (
                <article
                  key={item.slug}
                  role="button"
                  tabIndex={0}
                  aria-pressed={on}
                  onClick={() => setSelected(item.slug)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelected(item.slug);
                    }
                  }}
                  className="flex cursor-pointer flex-col rounded-[24px] border border-line bg-white p-6"
                >
                  <p
                    className={
                      on
                        ? arabic
                          ? "font-arabic text-[14px] text-primary"
                          : "text-[11px] uppercase tracking-[0.16em] text-primary"
                        : arabic
                          ? "font-arabic text-[14px] text-neutral-400"
                          : "text-[11px] uppercase tracking-[0.16em] text-neutral-400"
                    }
                  >
                    {item.is_highlighted ? copy.chosen : item.support_label}
                  </p>
                  <h2 className={`mt-3 ${arabic ? "font-arabic text-[28px] font-extrabold" : "font-display text-[30px] tracking-tight"}`}>
                    {item.name}
                  </h2>
                  <p className={`mt-3 text-sm leading-6 text-neutral-500 xl:min-h-[72px] ${arabic ? "font-arabic text-[15px] leading-7" : ""}`}>
                    {item.tagline}
                  </p>
                  <p className="mt-6 font-display text-[40px] leading-none tracking-[-0.04em]">
                    {formatPrice(item.price, item.currency)}
                  </p>
                  <p className={`mt-2 text-neutral-400 ${arabic ? "font-arabic text-[14px]" : "text-[11px] uppercase tracking-[0.16em]"}`}>
                    {item.duration_weeks} {t.weeks}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {included.map((row) => (
                      <li key={row.key} className={`text-sm text-neutral-600 ${arabic ? "font-arabic text-[15px]" : ""}`}>
                        {t.features[row.key]}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Button
                      href={`/checkout/${item.slug}`}
                      variant={on ? "primary" : "outline"}
                      className={`w-full ${arabic ? "font-arabic" : ""}`}
                    >
                      {copy.start} {item.name}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <Container>
          <Reveal>
            <p className={arabic ? "font-arabic text-[15px] text-muted" : "text-[11px] uppercase tracking-[0.22em] text-muted"}>
              {copy.compare}
            </p>
            <h2
              className={
                arabic
                  ? "mt-3 font-arabic text-[clamp(28px,3.8vw,44px)] font-extrabold leading-[1.2]"
                  : "mt-3 font-display text-[clamp(32px,4vw,48px)] font-medium leading-[0.9] tracking-[-0.04em]"
              }
            >
              {copy.included}
            </h2>
          </Reveal>
          <div className="mt-10 md:hidden">
            {packages
              .filter((item) => item.slug === selected)
              .map((item) => (
                <div key={item.slug} className="border-t border-line">
                  <p className={`py-4 ${arabic ? "font-arabic text-xl font-semibold text-primary" : "font-display text-2xl tracking-tight text-primary"}`}>
                    {item.name}
                  </p>
                  <div className="flex justify-between border-b border-line py-3 text-sm">
                    <span className="text-neutral-500">{copy.duration}</span>
                    <span>{`${item.duration_weeks} ${t.weeks}`}</span>
                  </div>
                  {packageFeatureLabels.map((row) => (
                    <div key={row.key} className="flex justify-between gap-4 border-b border-line py-3 text-sm">
                      <span className={`text-neutral-500 ${arabic ? "font-arabic" : ""}`}>{t.features[row.key]}</span>
                      <span className={item.features[row.key] ? "text-black" : "text-neutral-300"}>
                        {item.features[row.key] ? copy.yes : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
          </div>
          <div className="mt-10 hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] border-collapse text-start">
              <thead>
                <tr className="border-b border-line">
                  <th className="w-[22%] py-4 pe-4" />
                  {packages.map((item) => (
                    <th
                      key={item.slug}
                      onClick={() => setSelected(item.slug)}
                      className={`cursor-pointer py-4 text-center ${arabic ? "font-arabic text-lg font-semibold" : "font-display text-xl tracking-tight"} ${
                        item.slug === selected ? "text-primary" : ""
                      }`}
                    >
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line">
                  <th className={`py-4 pe-4 text-start font-normal text-neutral-500 ${arabic ? "font-arabic" : ""}`}>
                    {copy.duration}
                  </th>
                  {packages.map((item) => (
                    <td key={item.slug} className={`py-4 text-center text-sm ${arabic ? "font-arabic" : ""}`}>
                      {`${item.duration_weeks} ${t.weeks}`}
                    </td>
                  ))}
                </tr>
                {packageFeatureLabels.map((row) => (
                  <tr key={row.key} className="border-b border-line">
                    <th className={`py-4 pe-4 text-start font-normal text-neutral-500 ${arabic ? "font-arabic" : ""}`}>
                      {t.features[row.key]}
                    </th>
                    {packages.map((item) => (
                      <td
                        key={item.slug}
                        className={`py-4 text-center text-sm ${item.features[row.key] ? "text-black" : "text-neutral-300"} ${arabic ? "font-arabic" : ""}`}
                      >
                        {item.features[row.key] ? copy.yes : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <p className={`max-w-md text-lg leading-8 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{copy.close}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <Button href="/contact" className={arabic ? "font-arabic" : undefined}>
              {t.talkCoach}
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
