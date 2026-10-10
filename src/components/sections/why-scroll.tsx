"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";

import { useLang } from "@/lib/i18n";
import { useDesktop } from "@/lib/use-desktop";

const ITEM = 180;

type Reason = { n: string; title: string; body: string };

function ReasonLine({
  item,
  index,
  progress,
  span,
  arabic,
}: {
  item: Reason;
  index: number;
  progress: MotionValue<number>;
  span: number;
  arabic: boolean;
}) {
  const opacity = useTransform(progress, (value) => {
    const distance = Math.abs(value * span - index);
    return Math.max(0.12, 1 - distance * 0.75);
  });

  return (
    <li className="flex items-center gap-5 px-6 md:gap-6 md:px-4" style={{ height: ITEM }}>
      <motion.span
        aria-hidden
        style={{ opacity }}
        className="w-8 shrink-0 font-display text-2xl font-extrabold tabular-nums leading-none tracking-tight text-primary"
      >
        {index + 1}
      </motion.span>
      <motion.p
        style={{ opacity }}
        className={
          arabic
            ? "font-arabic text-[clamp(26px,3.4vw,48px)] font-extrabold leading-[1.15] text-black"
            : "font-display text-[clamp(30px,3.8vw,56px)] font-extrabold uppercase leading-[0.95] tracking-[-0.045em] text-black"
        }
      >
        {item.title}
      </motion.p>
      <span className="sr-only">
        {item.n}. {item.body}
      </span>
    </li>
  );
}

function ReasonCopy({
  item,
  index,
  progress,
  span,
  arabic,
}: {
  item: Reason;
  index: number;
  progress: MotionValue<number>;
  span: number;
  arabic: boolean;
}) {
  const opacity = useTransform(progress, (value) => {
    const distance = Math.abs(value * span - index);
    return Math.max(0, 1 - distance * 1.35);
  });
  const y = useTransform(progress, (value) => (value * span - index) * -10);

  return (
    <motion.p
      style={{ opacity, y }}
      className={`absolute max-w-[320px] text-base leading-7 text-muted ${arabic ? "font-arabic" : ""}`}
    >
      {item.body}
    </motion.p>
  );
}

export function WhyScroll() {
  const { t, reasons, arabic } = useLang();
  const desktop = useDesktop();
  const reduce = Boolean(useReducedMotion());
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  const total = reasons.length;
  const span = Math.max(total - 1, 1);
  const listY = useTransform(scrollYProgress, [0, 1], [0, -ITEM * span]);
  const ring = 2 * Math.PI * 46;
  const dash = useTransform(scrollYProgress, [0, 1], [ring, 0]);
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(span, Math.max(0, Math.round(value * span)));
    setActive((current) => (current === next ? current : next));
  });

  if (!desktop || reduce) {
    return (
      <section id="why" className="bg-surface py-16 md:py-24" aria-labelledby="why-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
          <h2
            id="why-heading"
            className={
              arabic
                ? "font-arabic text-[clamp(28px,8vw,44px)] font-extrabold leading-[1.15] text-primary"
                : "font-display text-[clamp(32px,9vw,48px)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-primary"
            }
          >
            {t.whyHeading}
          </h2>
          <ol className="mt-10 divide-y divide-line border-y border-line">
            {reasons.map((item, index) => (
              <li key={item.n} className="py-8">
                <p className="font-display text-sm font-extrabold text-primary">{String(index + 1).padStart(2, "0")}</p>
                <h3
                  className={
                    arabic
                      ? "mt-3 font-arabic text-[26px] font-extrabold leading-[1.2]"
                      : "mt-3 font-display text-[28px] font-extrabold uppercase leading-[0.95] tracking-[-0.04em]"
                  }
                >
                  {item.title}
                </h3>
                <p className={`mt-3 max-w-md text-[15px] leading-7 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="why" className="bg-surface" aria-labelledby="why-heading">
      <div ref={track} className="relative" style={{ height: reduce ? "auto" : `${total * 70}vh` }}>
        <div className={reduce ? "relative py-16" : "sticky top-20 h-[calc(100svh-5rem)] overflow-hidden"}>
          <div className="relative grid h-full min-h-[70vh] w-full grid-cols-1 md:h-full md:min-h-0 md:grid-cols-[auto_minmax(0,1fr)_minmax(220px,0.7fr)]">
            <div className="flex items-center gap-5 px-6 pt-6 md:px-8 md:pt-0 lg:pl-10">
              <h2
                id="why-heading"
                className={
                  arabic
                    ? "font-arabic text-[28px] font-extrabold leading-[1.1] text-primary md:text-[18px] md:[writing-mode:vertical-rl] md:[transform:rotate(180deg)]"
                    : "font-display text-[28px] font-extrabold uppercase leading-[0.9] tracking-[-0.04em] text-primary md:text-[15px] md:tracking-[0.38em] md:[writing-mode:vertical-rl] md:[transform:rotate(180deg)]"
                }
              >
                {t.whyHeading}
              </h2>
              <div className="relative hidden h-36 w-36 shrink-0 md:block">
                <svg viewBox="0 0 100 100" className="-rotate-90" aria-hidden>
                  <circle cx="50" cy="50" r="46" fill="none" stroke="#d9d9d9" strokeWidth="1.1" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="46"
                    fill="none"
                    stroke="#2443b2"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeDasharray={ring}
                    style={{ strokeDashoffset: reduce ? 0 : dash }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-display text-lg font-extrabold tabular-nums text-white">
                    {active + 1}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative h-full overflow-hidden">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-surface to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-surface to-transparent" />
              <div className="absolute inset-0">
                <motion.ul
                  className="absolute left-0 right-0 top-1/2 w-full will-change-transform"
                  style={{ marginTop: -ITEM / 2, y: reduce ? 0 : listY }}
                >
                  {reasons.map((item, index) => (
                    <ReasonLine key={item.n} item={item} index={index} progress={scrollYProgress} span={span} arabic={arabic} />
                  ))}
                </motion.ul>
              </div>
            </div>

            <div className="relative hidden h-full items-center pr-10 md:flex lg:pr-16">
              {reasons.map((item, index) => (
                <ReasonCopy key={item.n} item={item} index={index} progress={scrollYProgress} span={span} arabic={arabic} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
