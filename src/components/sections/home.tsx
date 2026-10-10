"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { PlanCards } from "@/components/sections/plan-cards";
import { ProcessStack } from "@/components/sections/process-stack";
import { ProgramSwipe } from "@/components/sections/program-swipe";
import { WhyScroll } from "@/components/sections/why-scroll";
import { FaqPanel } from "@/components/sections/faq-panel";
import { FlipShotCard } from "@/components/ui/flip-shot-card";
import { Button, Container, Media, Reveal } from "@/components/ui/primitives";
import { aboutHome } from "@/lib/constants/site";
import { useLang } from "@/lib/i18n";
import { ease } from "@/lib/utils";
import type { Package, Program, Testimonial, Transformation } from "@/types";

export function Hero() {
  const reduce = Boolean(useReducedMotion());
  const { t, arabic } = useLang();
  return (
    <section className="px-5 pt-4 md:px-10">
      <div className="relative min-h-[78vh] overflow-hidden rounded-[28px] bg-black md:min-h-[86vh] md:rounded-[36px]">
        <motion.div
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          <Media
            src="/images/hero/stage-cinematic.jpg"
            alt="Badran on stage holding a trophy"
            priority
            sizes="100vw"
            position="70% 12%"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
          <motion.p
            className={`text-white/65 ${arabic ? "font-arabic text-[15px]" : "text-[11px] uppercase tracking-[0.22em]"}`}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
          >
            {t.heroKicker}
          </motion.p>
          <motion.h1
            className={`mt-4 max-w-[10ch] font-extrabold text-white ${arabic ? "font-arabic text-[clamp(28px,9vw,58px)] leading-[1.15]" : "font-display text-[clamp(30px,10vw,68px)] uppercase leading-[0.88] tracking-[-0.045em]"}`}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.28 }}
          >
            {t.heroTitle[0]}
            <br />
            {t.heroTitle[1]}
            <br />
            {t.heroTitle[2]}
          </motion.h1>
          <motion.p
            className={`mt-6 max-w-[28ch] text-base leading-7 text-white/80 ${arabic ? "font-arabic" : ""}`}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.42 }}
          >
            {t.heroLead}
          </motion.p>
          <motion.div
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.55 }}
          >
            <Button href="/programs" variant="white" className={`w-full sm:w-auto ${arabic ? "font-arabic" : ""}`}>
              {t.startProgram}
            </Button>
            <Button href="/contact" variant="outlineLight" className={`w-full sm:w-auto ${arabic ? "font-arabic" : ""}`}>
              {t.talkCoach}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function AboutUs() {
  const { lang, arabic } = useLang();
  const copy = aboutHome[lang];

  return (
    <section id="about" className="border-b border-line" aria-labelledby="about-heading">
      <Container className="py-20 md:py-28">
        <div key={lang} className={arabic ? "font-arabic" : ""}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <p className={arabic ? "text-[15px] text-primary" : "text-[11px] uppercase tracking-[0.22em] text-primary"}>
                {copy.label}
              </p>
              <h2
                id="about-heading"
                className={
                  arabic
                    ? "mt-4 max-w-[16ch] text-[clamp(32px,4.2vw,52px)] font-extrabold leading-[1.2]"
                    : "mt-4 max-w-[14ch] font-display text-[clamp(36px,4.6vw,64px)] font-extrabold uppercase leading-[0.88] tracking-[-0.045em]"
                }
              >
                {copy.title}
              </h2>
              <div className="mt-8 hidden lg:block">
                <Button href="/about" variant="outline" className={arabic ? "font-arabic" : undefined}>
                  {copy.action}
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-7">
              <div className="space-y-5 text-base leading-8 text-neutral-700 md:text-lg">
                {copy.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <dl className="mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
                {copy.principles.map((item, index) => (
                  <div key={item.title}>
                    <dt className="flex items-baseline gap-2">
                      <span className="font-display text-sm font-extrabold text-primary">{String(index + 1).padStart(2, "0")}</span>
                      <span className={arabic ? "text-lg font-semibold" : "font-display text-lg tracking-tight"}>{item.title}</span>
                    </dt>
                    <dd className="mt-3 text-sm leading-6 text-neutral-500">{item.body}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-10 lg:hidden">
                <Button href="/about" variant="outline" className={arabic ? "font-arabic" : undefined}>
                  {copy.action}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function ProgramBand({ programs }: { programs: Program[] }) {
  return <ProgramSwipe programs={programs} />;
}

export function Process() {
  return <ProcessStack />;
}

export function TransformationBand({ items }: { items: Transformation[] }) {
  const { t, arabic } = useLang();
  const shown = items.slice(0, 3);
  if (!shown.length) return null;

  return (
    <section className="py-16 md:py-24" aria-labelledby="work-heading">
      <Container>
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
            <h2
              id="work-heading"
              className={
                arabic
                  ? "font-arabic text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.15]"
                  : "font-display text-[clamp(36px,4.4vw,60px)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]"
              }
            >
              {t.workHeading}
            </h2>
            <Link
              href="/transformations"
              className={`text-neutral-500 hover:text-black ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.18em]"}`}
            >
              {t.allResults}
            </Link>
          </div>
        </Reveal>
      </Container>

      <div className="grid gap-1 px-5 md:grid-cols-3 md:px-10">
        {shown.map((item) => (
          <FlipShotCard key={item.slug} item={item} arabic={arabic} t={t} />
        ))}
      </div>
    </section>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const item = items[0];
  if (!item) return null;
  return (
    <section className="border-y border-line py-20 md:py-28">
      <Container>
        <Reveal>
          <blockquote className="mx-auto max-w-4xl text-center">
            <p className="font-display text-[clamp(26px,3.6vw,48px)] font-medium leading-[1.15] tracking-[-0.03em]">
              “{item.quote}”
            </p>
            <footer className="mt-8 text-sm text-muted">
              {item.client_name} · {item.program_name}
            </footer>
          </blockquote>
        </Reveal>
      </Container>
    </section>
  );
}

export function PricingBand({ packages }: { packages: Package[] }) {
  return (
    <section id="pricing" className="scroll-mt-24 bg-white pb-8 pt-16 md:pb-10 md:pt-24">
      <Container>
        <PlanCards packages={packages} />
      </Container>
    </section>
  );
}

export function Why() {
  return <WhyScroll />;
}

export function FaqPreview() {
  const { faqs } = useLang();
  return <FaqPanel items={faqs.slice(0, 5)} compactTop />;
}

export function FinalCta() {
  const { t, arabic } = useLang();
  return (
    <section className="bg-white text-black">
      <Container className="flex flex-col items-start justify-between gap-8 pb-8 pt-20 md:flex-row md:items-end md:pb-10 md:pt-24">
        <Reveal>
          <h2
            className={
              arabic
                ? "max-w-[12ch] font-arabic text-[clamp(36px,5vw,68px)] font-extrabold leading-[1.15]"
                : "max-w-[10ch] font-display text-[clamp(44px,6vw,80px)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em]"
            }
          >
            {t.readyTitle}
          </h2>
          <p className={`mt-5 max-w-sm text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{t.readyLead}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Button href="/programs" className={arabic ? "font-arabic" : undefined}>
            {t.startProgram}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
