"use client";

import { Button, Container, Media } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { pickLocale } from "@/lib/locale";
import { useSiteHome } from "@/lib/site-home-context";
import type { Transformation } from "@/types";

export function ResultDetail({ item }: { item: Transformation }) {
  const { t, lang, arabic } = useLang();
  const action = useSiteHome().pages.transformations.action[lang];
  const same = item.before_image === item.after_image;

  return (
    <article className="pb-24 pt-8">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] md:rounded-[36px] lg:col-span-6">
          <Media src={item.cover_image || item.before_image} alt={item.image_alt} priority />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className={`text-muted ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.2em]"}`}>
            {pickLocale(item.program_name, item.program_name_ar, lang)}
          </p>
          <h1 className={`mt-3 ${arabic ? "font-arabic text-4xl font-extrabold md:text-6xl" : "font-display text-4xl tracking-tight md:text-7xl"}`}>
            {pickLocale(item.client_name, item.client_name_ar, lang)}
          </h1>
          {item.duration_weeks ? (
          <p className={`mt-6 font-display text-3xl md:text-5xl ${arabic ? "font-arabic" : ""}`}>
            {item.duration_weeks} {t.weeks}
          </p>
          ) : null}
          <p className={`mt-4 text-lg leading-8 ${arabic ? "font-arabic" : ""}`}>{pickLocale(item.result_summary, item.result_summary_ar, lang)}</p>
          <p className={`mt-6 text-lg leading-8 text-title ${arabic ? "font-arabic" : ""}`}>{pickLocale(item.story, item.story_ar, lang)}</p>
          {!same ? (
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Media src={item.before_image} alt={`${item.client_name} before`} />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Media src={item.after_image} alt={`${item.client_name} after`} />
              </div>
            </div>
          ) : null}
          <div className="mt-8">
            <Button href="/programs" className={arabic ? "font-arabic" : undefined}>
              {action || t.seePrograms}
            </Button>
          </div>
        </div>
      </Container>
    </article>
  );
}
