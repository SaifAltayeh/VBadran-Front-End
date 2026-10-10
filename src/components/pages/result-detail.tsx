"use client";

import { Button, Container, Media } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import type { Transformation } from "@/types";

export function ResultDetail({ item }: { item: Transformation }) {
  const { t, arabic } = useLang();
  const same = item.before_image === item.after_image;

  return (
    <article className="pb-24 pt-8">
      <Container className="grid gap-10 lg:grid-cols-12">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[20px] md:rounded-[36px] lg:col-span-6">
          <Media src={item.cover_image || item.before_image} alt={item.image_alt} priority />
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{item.program_name}</p>
          <h1 className="mt-3 font-display text-4xl tracking-tight md:text-7xl">{item.client_name}</h1>
          <p className={`mt-6 font-display text-3xl md:text-5xl ${arabic ? "font-arabic" : ""}`}>
            {item.duration_weeks} {t.weeks}
          </p>
          <p className="mt-4 text-lg leading-8">{item.result_summary}</p>
          <p className="mt-6 text-lg leading-8 text-neutral-800">{item.story}</p>
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
              {t.seePrograms}
            </Button>
          </div>
        </div>
      </Container>
    </article>
  );
}
