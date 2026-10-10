"use client";

import Link from "next/link";

import { FlipShotCard } from "@/components/ui/flip-shot-card";
import { Button, Container, Reveal } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import type { Transformation } from "@/types";

export function ResultsContent({ items }: { items: Transformation[] }) {
  const { t, arabic } = useLang();
  const copy = t.resultsPage;

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
                  ? "mt-4 max-w-[12ch] font-arabic text-[clamp(32px,9vw,68px)] font-extrabold leading-[1.15]"
                  : "mt-4 max-w-[10ch] font-display text-[clamp(34px,10vw,76px)] font-medium leading-[0.9] tracking-[-0.045em]"
              }
            >
              {copy.title[0]}
              <br />
              {copy.title[1]}
            </h1>
            <p className={`mt-5 max-w-md text-base leading-7 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{copy.lead}</p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-16 md:pb-24">
        <Container>
          <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
            {items.map((item, index) => (
              <article key={item.slug} className="flex flex-col">
                <FlipShotCard
                  item={item}
                  t={t}
                  arabic={arabic}
                  rounded
                  showCaption={false}
                  priority={index < 3}
                  sizes="(min-width: 768px) 30vw, 100vw"
                />
                <p className={`mt-4 text-neutral-400 ${arabic ? "font-arabic text-[14px]" : "text-[11px] uppercase tracking-[0.16em]"}`}>
                  {item.duration_weeks} {t.weeks} · {item.program_name}
                </p>
                <h2 className={`mt-2 ${arabic ? "font-arabic text-[26px] font-extrabold leading-[1.2]" : "font-display text-[28px] tracking-tight"}`}>
                  {item.client_name}
                </h2>
                <p className={`mt-2 line-clamp-2 text-sm leading-6 text-neutral-500 ${arabic ? "font-arabic text-[15px] leading-7" : ""}`}>
                  {item.result_summary}
                </p>
                <Link
                  href={`/transformations/${item.slug}`}
                  className={`mt-3 text-neutral-500 hover:text-black ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.16em]"}`}
                >
                  {t.viewCase}
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <p className={`max-w-md text-lg leading-8 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{copy.close}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <Button href="/programs" className={arabic ? "font-arabic" : undefined}>
              {t.seePrograms}
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
