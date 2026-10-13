"use client";

import { Accordion, Button, Container, Media } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";
import type { Program } from "@/types";

export function ProgramDetail({ program }: { program: Program }) {
  const { t, arabic } = useLang();
  const copy = t.programDetail;

  return (
    <article className="pb-24 pt-6">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <p className={`text-muted ${arabic ? "font-arabic text-[15px]" : "text-[11px] uppercase tracking-[0.2em]"}`}>
              {program.category_label}
            </p>
            <h1
              className={
                arabic
                  ? "mt-3 max-w-full break-words font-arabic text-[clamp(28px,8vw,72px)] font-extrabold leading-[1.15]"
                  : "mt-3 max-w-full break-words font-display text-[clamp(26px,7.2vw,88px)] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] md:leading-[0.88] md:tracking-[-0.045em]"
              }
            >
              {program.title}
            </h1>
            <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-[20px] md:rounded-[36px]">
              <Media src={program.featured_image} alt={program.image_alt} priority sizes="(min-width: 1024px) 60vw, 100vw" />
            </div>
            <div className="mt-12 max-w-3xl space-y-14 break-words">
              <section>
                <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.overview}</h2>
                <p className="mt-4 text-lg leading-8 text-neutral-800">{program.description}</p>
              </section>
              <section>
                <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.who}</h2>
                <p className="mt-4 text-lg leading-8 text-neutral-800">{program.who_for}</p>
              </section>
              <section>
                <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.receive}</h2>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {program.features.map((item) => (
                    <li key={item.id} className="py-3">
                      {item.text}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.structure}</h2>
                <p className="mt-4 text-lg leading-8 text-neutral-800">{program.training_structure}</p>
              </section>
              <section>
                <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.nutrition}</h2>
                <p className="mt-4 text-lg leading-8 text-neutral-800">{program.nutrition_overview}</p>
              </section>
              <section>
                <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.support}</h2>
                <p className="mt-4 text-lg leading-8 text-neutral-800">{program.support_overview}</p>
              </section>
              <section>
                <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.expected}</h2>
                <p className="mt-4 text-lg leading-8 text-neutral-800">{program.expected_outcome}</p>
              </section>
              {program.faqs.length ? (
                <section>
                  <h2 className={`mb-4 ${arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}`}>{t.faqKicker}</h2>
                  <Accordion items={program.faqs.map((item) => ({ q: item.question, a: item.answer }))} />
                </section>
              ) : null}
            </div>
          </div>
          <aside className="min-w-0 lg:col-span-4">
            <div className="border border-line p-6 lg:sticky lg:top-24">
              <p className={`text-muted ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.18em]"}`}>
                {program.duration_weeks} {t.weeks} · {program.difficulty_label}
              </p>
              <p className="mt-4 font-display text-5xl">{formatPrice(program.price, program.currency)}</p>
              <p className="mt-4 text-sm leading-6 text-neutral-700">{program.short_description}</p>
              <div className="mt-6">
                <Button href={`/checkout/${program.slug}`} className={`w-full ${arabic ? "font-arabic" : ""}`}>
                  {copy.start}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </article>
  );
}
