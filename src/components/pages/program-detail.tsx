"use client";

import { Accordion, Button, Container, Media } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { formatDuration, pickLocale } from "@/lib/locale";
import { formatPrice } from "@/lib/utils";
import type { Program } from "@/types";

export function ProgramDetail({ program }: { program: Program }) {
  const { t, lang, arabic } = useLang();
  const copy = t.programDetail;
  const title = pickLocale(program.title, program.title_ar, lang);
  const description = pickLocale(program.description, program.description_ar, lang);
  const who = pickLocale(program.who_for, program.who_for_ar, lang);
  const structure = pickLocale(program.training_structure, program.training_structure_ar, lang);
  const expected = pickLocale(program.expected_outcome, program.expected_outcome_ar, lang);
  const shortDescription = pickLocale(program.short_description, program.short_description_ar, lang);
  const duration = formatDuration(program.duration_weeks, t.weeks);
  const features = program.features
    .map((item) => ({ id: item.id, text: pickLocale(item.text, item.text_ar, lang) }))
    .filter((item) => item.text);
  const faqs = program.faqs
    .map((item) => ({
      q: pickLocale(item.question, item.question_ar, lang),
      a: pickLocale(item.answer, item.answer_ar, lang),
    }))
    .filter((item) => item.q && item.a);

  return (
    <article className="pb-24 pt-6">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <h1
              className={
                arabic
                  ? "mt-3 max-w-full break-words font-arabic text-[clamp(28px,8vw,72px)] font-extrabold leading-[1.15]"
                  : "mt-3 max-w-full break-words font-display text-[clamp(26px,7.2vw,88px)] font-extrabold uppercase leading-[1.05] tracking-[-0.02em] md:leading-[0.88] md:tracking-[-0.045em]"
              }
            >
              {title}
            </h1>
            {program.featured_image ? (
              <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-[20px] md:rounded-[36px]">
                <Media src={program.featured_image} alt={program.image_alt || title} priority sizes="(min-width: 1024px) 60vw, 100vw" />
              </div>
            ) : null}
            <div className="mt-12 max-w-3xl space-y-14 break-words">
              {description ? (
                <section>
                  <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.overview}</h2>
                  <p className="mt-4 text-lg leading-8 text-title">{description}</p>
                </section>
              ) : null}
              {who ? (
                <section>
                  <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.who}</h2>
                  <p className="mt-4 text-lg leading-8 text-title">{who}</p>
                </section>
              ) : null}
              {features.length ? (
                <section>
                  <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.receive}</h2>
                  <ul className="mt-4 divide-y divide-line border-y border-line">
                    {features.map((item) => (
                      <li key={item.id} className="py-3">
                        {item.text}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
              {structure ? (
                <section>
                  <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.structure}</h2>
                  <p className="mt-4 text-lg leading-8 text-title">{structure}</p>
                </section>
              ) : null}
              {expected ? (
                <section>
                  <h2 className={arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}>{copy.expected}</h2>
                  <p className="mt-4 text-lg leading-8 text-title">{expected}</p>
                </section>
              ) : null}
              {faqs.length ? (
                <section>
                  <h2 className={`mb-4 ${arabic ? "font-arabic text-3xl md:text-4xl" : "font-display text-3xl md:text-4xl"}`}>{t.faqKicker}</h2>
                  <Accordion items={faqs} />
                </section>
              ) : null}
            </div>
          </div>
          <aside className="min-w-0 lg:col-span-4">
            <div className="border border-line p-6 lg:sticky lg:top-24">
              {duration ? (
                <p className={`text-muted ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.18em]"}`}>{duration}</p>
              ) : null}
              <p className="mt-4 font-display text-5xl">{formatPrice(program.price, program.currency, lang)}</p>
              {shortDescription ? <p className="mt-4 text-sm leading-6 text-subtitle">{shortDescription}</p> : null}
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
