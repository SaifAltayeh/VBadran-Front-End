"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { Button, Container } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function FaqPanel({ items, compactTop = false }: { items?: { q: string; a: string }[]; compactTop?: boolean }) {
  const { t, faqs, arabic } = useLang();
  const list = items ?? faqs;
  const [open, setOpen] = useState<number | null>(list.length > 1 ? 1 : 0);

  return (
    <section className={cn("bg-surface pb-16 md:pb-20", compactTop ? "pt-10 md:pt-14" : "pt-8 md:pt-10")}>
      <Container>
          <div className="rounded-[22px] bg-white px-5 py-7 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.35)] md:rounded-[40px] md:px-10 md:py-12 lg:px-14 lg:py-14">
            <div className="grid gap-12 lg:grid-cols-[minmax(220px,0.4fr)_minmax(0,1fr)] lg:gap-16">
              <div className="flex flex-col">
                <p className={`flex items-center gap-2 text-[12px] text-neutral-400 ${arabic ? "font-arabic" : ""}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {t.faqKicker}
                </p>
                <h2
                  className={
                    arabic
                      ? "mt-4 max-w-[14ch] font-arabic text-[clamp(28px,3.8vw,42px)] font-medium leading-[1.25] text-neutral-950"
                      : "mt-4 max-w-[12ch] font-display text-[clamp(32px,4vw,46px)] font-medium leading-[1.15] tracking-[-0.03em] text-neutral-950"
                  }
                >
                  {t.faqTitle}
                </h2>
                <div className="mt-10 lg:mt-auto lg:pt-20">
                  <p className={`text-[15px] font-medium text-neutral-950 ${arabic ? "font-arabic" : ""}`}>{t.faqStill}</p>
                  <p className={`mt-1 max-w-[22ch] text-sm leading-6 text-neutral-400 ${arabic ? "font-arabic" : ""}`}>
                    {t.faqStillBody}
                  </p>
                  <div className="mt-5">
                    <Button href="/contact" arrow={false} className={cn("px-6 py-3", arabic && "font-arabic")}>
                      {t.contactUs}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                {list.map((item, index) => {
                  const expanded = open === index;
                  const number = String(index + 1).padStart(2, "0");
                  return (
                    <div key={item.q} className={cn(index > 0 && "border-t border-neutral-100")}>
                      <button
                        type="button"
                        className="grid w-full grid-cols-[2.25rem_minmax(0,1fr)_1.25rem] items-start gap-3 py-5 text-start md:gap-4"
                        aria-expanded={expanded}
                        onClick={() => setOpen(expanded ? null : index)}
                      >
                        <span className="pt-0.5 text-[13px] text-neutral-300">{number}</span>
                        <span className={cn("text-[15px] font-medium leading-6 text-neutral-900 md:text-base", arabic && "font-arabic")}>{item.q}</span>
                        {expanded ? (
                          <Minus className="mt-1 h-4 w-4 text-neutral-400" strokeWidth={1.75} />
                        ) : (
                          <Plus className="mt-1 h-4 w-4 text-neutral-400" strokeWidth={1.75} />
                        )}
                      </button>
                      <div className={cn("grid transition-[grid-template-rows] duration-500", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                        <div className="overflow-hidden">
                          <p className="grid grid-cols-[2.25rem_minmax(0,1fr)_1.25rem] gap-3 pb-5 text-[14px] leading-6 text-neutral-500 md:gap-4">
                            <span />
                            <span className={arabic ? "font-arabic" : undefined}>{item.a}</span>
                            <span />
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
      </Container>
    </section>
  );
}
