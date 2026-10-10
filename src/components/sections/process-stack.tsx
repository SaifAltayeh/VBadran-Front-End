"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import { useLang } from "@/lib/i18n";
import { useDesktop } from "@/lib/use-desktop";

const tilts = [-1.6, 1.25, -0.7, 1.45, -1.15];

type Step = {
  n: string;
  title: string;
  body: string;
  points: readonly string[];
};

function StepCard({
  step,
  index,
  total,
  arabic,
}: {
  step: Step;
  index: number;
  total: number;
  arabic: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const isLast = index === total - 1;
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.93]);
  const fade = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.88]);

  return (
    <li
      ref={ref}
      className="sticky top-[18vh] flex h-[82vh] justify-center"
      style={{ zIndex: index + 1 }}
    >
      <motion.article
        style={reduce ? { rotate: tilts[index] } : { scale, opacity: fade, rotate: tilts[index] }}
        className="flex h-[min(58vh,460px)] w-[min(90vw,500px)] flex-col justify-between rounded-[18px] border border-black/[0.06] bg-[#e8eef3] px-8 py-9 shadow-[0_24px_50px_rgba(0,0,0,0.08)] md:px-10 md:py-10"
      >
        <div>
          <h3
            className={
              arabic
                ? "max-w-[14ch] font-arabic text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.15]"
                : "max-w-[11ch] font-display text-[clamp(34px,4.2vw,52px)] font-extrabold uppercase leading-[0.88] tracking-[-0.05em]"
            }
          >
            {step.title}
          </h3>
          <p className={`mt-8 max-w-[32ch] text-[15px] leading-7 text-neutral-800 ${arabic ? "font-arabic" : ""}`}>{step.body}</p>
        </div>
        <div className="flex items-end justify-between gap-6">
          <ul className={`space-y-1 text-[15px] font-medium leading-6 ${arabic ? "font-arabic" : ""}`}>
            {step.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="font-display text-[64px] font-extrabold leading-none tracking-[-0.06em] md:text-[72px]">
            {step.n}
          </p>
        </div>
      </motion.article>
    </li>
  );
}

export function ProcessStack() {
  const { t, process, arabic } = useLang();
  const desktop = useDesktop();
  const reduce = Boolean(useReducedMotion());

  if (!desktop || reduce) {
    return (
      <section id="how" className="bg-white py-16 md:py-24" aria-labelledby="how-heading">
        <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
          <h2
            id="how-heading"
            className={
              arabic
                ? "font-arabic text-[clamp(28px,8vw,44px)] font-extrabold leading-[1.15]"
                : "font-display text-[clamp(32px,9vw,48px)] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]"
            }
          >
            {t.howHeading}
          </h2>
          <ol className="mt-10 space-y-4">
            {process.map((step) => (
              <li
                key={step.n}
                className="flex flex-col justify-between rounded-[18px] border border-black/[0.06] bg-[#e8eef3] px-6 py-7"
              >
                <div>
                  <p className="font-display text-sm font-extrabold text-primary">{step.n}</p>
                  <h3
                    className={
                      arabic
                        ? "mt-3 font-arabic text-[28px] font-extrabold leading-[1.15]"
                        : "mt-3 font-display text-[30px] font-extrabold uppercase leading-[0.9] tracking-[-0.04em]"
                    }
                  >
                    {step.title}
                  </h3>
                  <p className={`mt-4 text-[15px] leading-7 text-neutral-700 ${arabic ? "font-arabic" : ""}`}>{step.body}</p>
                </div>
                <ul className={`mt-6 space-y-1 text-[15px] font-medium ${arabic ? "font-arabic" : ""}`}>
                  {step.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section id="how" className="relative bg-white pb-32" aria-labelledby="how-heading">
      <h2 id="how-heading" className="sr-only">
        {t.howHeading}
      </h2>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <p
          className={`sticky top-[12vh] text-center font-extrabold text-[#c8c8c8] blur-[10px] ${
            arabic
              ? "font-arabic text-[clamp(72px,16vw,220px)] leading-[1.05]"
              : "font-display text-[clamp(92px,20vw,280px)] uppercase leading-[0.78] tracking-[-0.07em]"
          }`}
        >
          {t.howLines.map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>
      </div>
      <ol className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pt-[12vh]">
        {process.map((step, index) => (
          <StepCard key={step.n} step={step} index={index} total={process.length} arabic={arabic} />
        ))}
      </ol>
    </section>
  );
}
