"use client";

import Link from "next/link";

import { Media } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import type { Program } from "@/types";

export function ProgramBrowser({ programs }: { programs: Program[] }) {
  const { t, arabic } = useLang();

  if (!programs.length) {
    return <p className={`py-16 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{t.nothingCategory}</p>;
  }

  return (
    <div className="grid gap-x-6 gap-y-10 md:grid-cols-3">
      {programs.map((program, index) => (
        <Link key={program.slug} href={`/programs/${program.slug}`} className="group flex flex-col">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#0a1a4a]">
            <Media
              src={program.featured_image}
              alt={program.image_alt}
              priority={index < 3}
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
              className="transition-transform duration-700 group-hover:scale-[1.04]"
            />
          </div>
          <p className={`mt-4 text-neutral-400 ${arabic ? "font-arabic text-[14px]" : "text-[11px] uppercase tracking-[0.16em]"}`}>
            {program.duration_weeks} {t.weeks}
          </p>
          <h2 className={`mt-2 ${arabic ? "font-arabic text-[26px] font-extrabold leading-[1.2]" : "font-display text-[28px] tracking-tight"}`}>
            {program.title}
          </h2>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 text-neutral-500 ${arabic ? "font-arabic text-[15px] leading-7" : ""}`}>
            {program.short_description}
          </p>
          <p className="mt-4 font-display text-xl">{formatPrice(program.price, program.currency)}</p>
        </Link>
      ))}
    </div>
  );
}
