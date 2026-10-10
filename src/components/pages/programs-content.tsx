"use client";

import { ProgramBrowser } from "@/components/sections/program-browser";
import { Button, Container, Reveal } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import type { Program } from "@/types";

export function ProgramsContent({ programs }: { programs: Program[] }) {
  const { t, arabic } = useLang();
  const copy = t.programsPage;

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
              {copy.title}
            </h1>
            <p className={`mt-5 max-w-md text-base leading-7 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{copy.lead}</p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-16 md:pb-24">
        <Container>
          <ProgramBrowser programs={programs} />
        </Container>
      </section>

      <section className="border-t border-line py-16 md:py-24">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <p className={`max-w-md text-lg leading-8 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{copy.unsure}</p>
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
