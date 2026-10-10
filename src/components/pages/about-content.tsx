"use client";

import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useRef, useState } from "react";

import { FinalCta } from "@/components/sections/home";
import { Button, Container, Media, Reveal } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { useDesktop } from "@/lib/use-desktop";

function StoryChapter({
  index,
  title,
  body,
  arabic,
}: {
  index: number;
  title: string;
  body: string;
  arabic: boolean;
}) {
  const [first, ...rest] = title.split(" ");
  const second = rest.join(" ");

  return (
    <div className="grid w-full items-center gap-6 md:grid-cols-[4.5rem_minmax(0,1fr)_minmax(180px,0.55fr)] md:gap-10">
      <p className="text-[15px] tracking-[0.08em] text-neutral-400">/{String(index + 1).padStart(2, "0")}</p>
      <h3
        className={
          arabic
            ? "font-arabic text-[clamp(30px,8vw,72px)] font-extrabold leading-[1.1] text-primary"
            : "font-display text-[clamp(32px,9vw,80px)] font-medium leading-[0.92] tracking-[-0.04em] text-primary"
        }
      >
        {second ? (
          <>
            {first}
            <br />
            {second}
          </>
        ) : (
          title
        )}
      </h3>
      <p className={`max-w-[28ch] text-[13px] leading-6 text-neutral-500 md:justify-self-end ${arabic ? "font-arabic text-[15px] leading-7" : ""}`}>
        {body}
      </p>
    </div>
  );
}

function StoryStack({
  titles,
  bodies,
  arabic,
  heading,
  kicker,
}: {
  titles: readonly string[];
  bodies: readonly string[];
  arabic: boolean;
  heading: string;
  kicker: string;
}) {
  const reduce = Boolean(useReducedMotion());
  const desktop = useDesktop();
  const track = useRef<HTMLDivElement>(null);
  const total = bodies.length;
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(total - 1, Math.max(0, Math.floor(value * total - 0.0001)));
    setActive((current) => (current === next ? current : next));
  });

  if (reduce || !desktop) {
    return (
      <Container className="py-16 md:py-24">
        <p className={arabic ? "font-arabic text-[15px] text-primary" : "text-[11px] uppercase tracking-[0.22em] text-primary"}>
          {kicker}
        </p>
        <h2
          id="story-heading"
          className={
            arabic
              ? "mt-3 max-w-[16ch] font-arabic text-[clamp(28px,3.8vw,44px)] font-extrabold leading-[1.2]"
              : "mt-3 max-w-[14ch] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]"
          }
        >
          {heading}
        </h2>
        <div className="mt-10">
          {bodies.map((body, index) => (
            <div key={body} className="border-t border-line py-10 first:border-t-0 md:py-16">
              <StoryChapter index={index} title={titles[index]} body={body} arabic={arabic} />
            </div>
          ))}
        </div>
      </Container>
    );
  }

  return (
    <div ref={track} className="relative" style={{ height: `${(total - 1) * 80 + 100}vh` }}>
      <div className="sticky top-20 flex h-[calc(100svh-5rem)] flex-col overflow-hidden bg-white">
        <Container className="flex h-full flex-col">
          <div className="shrink-0 pb-8 pt-6 md:pb-10">
            <p className={arabic ? "font-arabic text-[15px] text-primary" : "text-[11px] uppercase tracking-[0.22em] text-primary"}>
              {kicker}
            </p>
            <h2
              id="story-heading"
              className={
                arabic
                  ? "mt-3 max-w-[16ch] font-arabic text-[clamp(28px,3.8vw,44px)] font-extrabold leading-[1.2]"
                  : "mt-3 max-w-[14ch] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]"
              }
            >
              {heading}
            </h2>
          </div>
          <div className="relative min-h-0 flex-1 overflow-hidden border-t border-line">
            {bodies.map((body, index) => {
              const on = index === active;
              return (
                <div
                  key={body}
                  className="absolute inset-0 flex items-center"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "translate3d(0,0,0)" : index < active ? "translate3d(0,-40px,0)" : "translate3d(0,56px,0)",
                    transition: "opacity 420ms ease, transform 420ms ease",
                    pointerEvents: on ? "auto" : "none",
                  }}
                >
                  <StoryChapter index={index} title={titles[index]} body={body} arabic={arabic} />
                </div>
              );
            })}
          </div>
        </Container>
      </div>
    </div>
  );
}

export function AboutContent() {
  const { t, arabic } = useLang();
  const copy = t.aboutPage;

  return (
    <>
      <section className="border-b border-line py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-7">
              <p className={arabic ? "font-arabic text-[15px] text-primary" : "text-[11px] uppercase tracking-[0.22em] text-primary"}>
                {copy.kicker}
              </p>
              <h1
                className={
                  arabic
                    ? "mt-6 max-w-[18ch] font-arabic text-[clamp(28px,8vw,60px)] font-extrabold leading-[1.2]"
                    : "mt-6 max-w-[16ch] font-display text-[clamp(28px,8.5vw,64px)] font-medium leading-[1.1] tracking-[-0.035em]"
                }
              >
                “{copy.quote}”
              </h1>
              <p className={`mt-8 ${arabic ? "font-arabic text-xl font-semibold" : "font-display text-2xl tracking-tight"}`}>
                {copy.name}
              </p>
              <p className={`mt-3 max-w-md text-base leading-7 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{copy.lead}</p>
              <div className="mt-8">
                <Button href="/contact" variant="outline" className={arabic ? "font-arabic" : undefined}>
                  {t.talkCoach}
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[28px] bg-[#0a1a4a] md:rounded-[32px]">
                <Media
                  src="/images/hero/coach-portrait.jpg"
                  alt="Portrait of Badran"
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  position="center 12%"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-white" aria-labelledby="story-heading">
        <StoryStack
          kicker={copy.story}
          heading={copy.title}
          titles={copy.storyChapters}
          bodies={copy.storyBody}
          arabic={arabic}
        />
        <div className="px-5 pb-16 pt-4 md:px-10 md:pb-24">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-black md:aspect-[21/9] md:rounded-[32px]">
            <Media src="/images/about/gym-walk.jpg" alt="Badran in the gym" sizes="100vw" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <Reveal>
            <p className={arabic ? "font-arabic text-[15px] text-muted" : "text-[11px] uppercase tracking-[0.22em] text-muted"}>
              {copy.method}
            </p>
            <h2
              className={
                arabic
                  ? "mt-3 max-w-[16ch] font-arabic text-[clamp(28px,3.8vw,44px)] font-extrabold leading-[1.2]"
                  : "mt-3 max-w-[14ch] font-display text-[clamp(32px,4vw,48px)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]"
              }
            >
              {copy.methodTitle}
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.map(([title, body], index) => (
              <Reveal key={title} delay={index * 0.06}>
                <li>
                  <p className="font-display text-sm font-extrabold text-primary">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className={`mt-4 ${arabic ? "font-arabic text-2xl font-semibold" : "font-display text-2xl tracking-tight"}`}>
                    {title}
                  </h3>
                  <p className={`mt-3 text-sm leading-6 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
