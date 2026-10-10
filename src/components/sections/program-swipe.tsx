"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

import { Media } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { useDesktop } from "@/lib/use-desktop";
import { cn, ease } from "@/lib/utils";
import type { Program } from "@/types";

export function ProgramSwipe({ programs }: { programs: Program[] }) {
  const { t, arabic } = useLang();
  const desktop = useDesktop();
  const [current, setCurrent] = useState(Math.min(1, programs.length - 1));
  const [hovered, setHovered] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const pointer = useRef<{ x: number; id: number } | null>(null);
  if (!programs.length) return null;

  const total = programs.length;
  const go = (offset: number) => setCurrent((value) => (value + offset + total) % total);
  const at = (offset: number) => programs[(current + offset + total) % total];
  const trio = desktop && total >= 3 ? [at(-1), at(0), at(1)] : [at(0)];
  const focused = hovered ?? (trio.length === 1 ? 0 : 1);
  const transition = reduce ? { duration: 0 } : { duration: 0.7, ease };

  return (
    <section className="pt-16 pb-8 md:pt-24 md:pb-10" aria-labelledby="programs-heading">
      <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2
            id="programs-heading"
            className={
              arabic
                ? "max-w-[18ch] font-arabic text-[clamp(26px,7vw,42px)] font-semibold leading-[1.2]"
                : "max-w-[18ch] font-display text-[clamp(28px,8vw,48px)] font-semibold leading-[1.05] tracking-[-0.03em]"
            }
          >
            {t.programsHeading}
          </h2>
          <Link href="/programs" className={`shrink-0 text-sm text-neutral-700 hover:text-black ${arabic ? "font-arabic" : ""}`}>
            {t.viewPrograms}
          </Link>
        </div>

        <div
          className="mt-8 grid h-[min(68svh,520px)] gap-2 [--side:0.55fr] md:mt-10 md:h-[clamp(380px,48vw,680px)] md:gap-3.5 md:[--side:1fr] motion-safe:transition-[grid-template-columns] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            touchAction: "pan-y",
            gridTemplateColumns: trio.map((_, index) => (index === focused ? "2fr" : "var(--side)")).join(" "),
          }}
          tabIndex={0}
          aria-label="Programs"
          aria-roledescription="carousel"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
          }}
          onMouseLeave={() => setHovered(null)}
          onPointerDown={(event) => {
            pointer.current = { x: event.clientX, id: event.pointerId };
          }}
          onPointerUp={(event) => {
            const start = pointer.current;
            pointer.current = null;
            if (!start || start.id !== event.pointerId) return;
            const delta = event.clientX - start.x;
            if (delta < -50) go(1);
            if (delta > 50) go(-1);
          }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {trio.map((program, index) => {
              const center = trio.length === 1 || index === 1;
              const sharp = index === focused;
              const tile = (
                <div className="relative h-full overflow-hidden rounded-[14px] bg-surface">
                  <Media
                    src={program.featured_image}
                    alt={program.image_alt}
                    sizes={center ? "(min-width: 768px) 50vw, 70vw" : "25vw"}
                    className={cn(
                      "pointer-events-none transition-[filter,transform] duration-500",
                      sharp ? "" : "scale-110 blur-[10px]",
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 pb-6 pt-24 text-white transition-opacity duration-500 md:px-6",
                      sharp ? "opacity-100" : "opacity-0",
                    )}
                  >
                    <p className="max-w-[34ch] text-[15px] leading-6 md:text-base">{program.short_description}</p>
                    <div className="mt-5 flex items-center justify-between text-sm text-white/85">
                      <span>{program.title}</span>
                      <span className={arabic ? "font-arabic" : undefined}>{program.duration_weeks} {t.weeks}</span>
                    </div>
                  </div>
                </div>
              );
              return (
                <motion.div
                  key={program.slug}
                  layout={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                  className="h-full min-w-0"
                  onMouseEnter={() => setHovered(index)}
                  onFocus={() => setHovered(index)}
                  onBlur={() => setHovered(null)}
                >
                  {center ? (
                    <Link href={`/programs/${program.slug}`} className="block h-full" aria-label={`${program.title}, view program`}>
                      {tile}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Show ${program.title}`}
                      onClick={() => go(index === 0 ? -1 : 1)}
                      className="block h-full w-full text-left"
                    >
                      {tile}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
