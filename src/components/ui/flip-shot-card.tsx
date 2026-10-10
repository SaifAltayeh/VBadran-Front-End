"use client";

import { useReducedMotion } from "framer-motion";
import { useState } from "react";

import { Media } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { afterShot, beforeShot } from "@/lib/transformation-shots";
import { cn } from "@/lib/utils";
import type { Transformation } from "@/types";

type Copy = ReturnType<typeof useLang>["t"];

function Face({
  src,
  alt,
  label,
  name,
  meta,
  hint,
  arabic,
  showCaption,
  rounded,
  sizes,
  priority,
  back = false,
}: {
  src: string;
  alt: string;
  label: string;
  name: string;
  meta: string;
  hint: string;
  arabic: boolean;
  showCaption: boolean;
  rounded: boolean;
  sizes: string;
  priority?: boolean;
  back?: boolean;
}) {
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden bg-black [backface-visibility:hidden]", rounded && "rounded-[24px]")}
      style={{ transform: back ? "rotateY(180deg)" : "rotateY(0deg)" }}
    >
      <Media src={src} alt={alt} sizes={sizes} priority={priority} />
      <div
        className={
          showCaption
            ? "absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"
            : "absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
        }
      />
      <span
        className={`absolute top-4 ${arabic ? "right-4" : "left-4"} rounded-full bg-black/55 px-3 py-1 text-white backdrop-blur-sm ${
          arabic ? "font-arabic text-[13px]" : "text-[10px] uppercase tracking-[0.18em]"
        }`}
      >
        {label}
      </span>
      {showCaption ? (
        <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
          <p
            className={
              arabic
                ? "font-arabic text-[28px] font-extrabold leading-none"
                : "font-display text-[32px] font-extrabold uppercase leading-none tracking-[-0.04em]"
            }
          >
            {name}
          </p>
          <p className={`mt-2 text-white/75 ${arabic ? "font-arabic text-sm" : "text-[12px] uppercase tracking-[0.16em]"}`}>{meta}</p>
          <p className={`mt-3 text-white/55 ${arabic ? "font-arabic text-[13px]" : "text-[10px] uppercase tracking-[0.16em]"}`}>{hint}</p>
        </div>
      ) : (
        <p
          className={`absolute inset-x-0 bottom-0 p-5 text-white/70 md:p-6 ${
            arabic ? "font-arabic text-[13px]" : "text-[10px] uppercase tracking-[0.16em]"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export function FlipShotCard({
  item,
  t,
  arabic,
  rounded = false,
  showCaption = true,
  sizes = "(min-width: 768px) 33vw, 100vw",
  priority = false,
}: {
  item: Transformation;
  t: Copy;
  arabic: boolean;
  rounded?: boolean;
  showCaption?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const reduce = Boolean(useReducedMotion());
  const before = beforeShot[item.slug] ?? item.cover_image;
  const after = afterShot[item.slug] ?? item.cover_image;
  const meta = `${item.duration_weeks} ${t.weeks} · ${item.program_name}`;

  return (
    <button
      type="button"
      onClick={() => setFlipped((open) => !open)}
      aria-pressed={flipped}
      aria-label={`${item.client_name}. ${flipped ? t.workAfter : t.workBefore}. ${t.workFlip}`}
      className="relative block aspect-[4/5] w-full cursor-pointer bg-transparent text-start [perspective:1400px]"
    >
      <div
        className={cn(
          "relative h-full w-full [transform-style:preserve-3d]",
          !reduce && "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
        )}
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <Face
          src={before}
          alt={`${item.client_name} — ${t.workBefore}`}
          label={t.workBefore}
          name={item.client_name}
          meta={meta}
          hint={t.workFlip}
          arabic={arabic}
          showCaption={showCaption}
          rounded={rounded}
          sizes={sizes}
          priority={priority}
        />
        <Face
          src={after}
          alt={`${item.client_name} — ${t.workAfter}`}
          label={t.workAfter}
          name={item.client_name}
          meta={meta}
          hint={t.workFlip}
          arabic={arabic}
          showCaption={showCaption}
          rounded={rounded}
          sizes={sizes}
          back
        />
      </div>
    </button>
  );
}
