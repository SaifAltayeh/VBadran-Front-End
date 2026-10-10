"use client";

import { ContactForm } from "@/components/forms/contact-form";
import { Container } from "@/components/ui/primitives";
import { site, socials } from "@/lib/constants/site";
import { useLang } from "@/lib/i18n";

export function ContactContent() {
  const { t, arabic } = useLang();
  const copy = t.contactPage;

  return (
    <section className="pb-20 pt-8 md:pb-24 md:pt-12">
      <Container>
        <p className={arabic ? "font-arabic text-[15px] text-primary" : "text-[11px] uppercase tracking-[0.22em] text-primary"}>
          {t.contact}
        </p>
        <h1
          className={
            arabic
              ? "mt-4 max-w-[14ch] font-arabic text-[clamp(32px,9vw,72px)] font-extrabold leading-[1.15]"
              : "mt-4 max-w-[12ch] font-display text-[clamp(34px,10vw,84px)] font-medium leading-[0.9] tracking-[-0.045em]"
          }
        >
          {copy.title}
        </h1>
        <p className={`mt-5 max-w-md text-base leading-7 text-neutral-600 ${arabic ? "font-arabic" : ""}`}>{copy.lead}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <a href={`mailto:${site.email}`} className="rounded-[24px] border border-line bg-white p-5 transition-colors hover:border-primary">
            <p className={arabic ? "font-arabic text-[14px] text-neutral-400" : "text-[12px] uppercase tracking-[0.16em] text-neutral-400"}>
              {copy.email}
            </p>
            <p className="mt-3 break-all font-display text-xl tracking-tight md:text-2xl">{site.email}</p>
          </a>
          <a href={site.phoneHref} className="rounded-[24px] border border-line bg-white p-5 transition-colors hover:border-primary">
            <p className={arabic ? "font-arabic text-[14px] text-neutral-400" : "text-[12px] uppercase tracking-[0.16em] text-neutral-400"}>
              {copy.phone}
            </p>
            <p className="mt-3 font-display text-xl tracking-tight md:text-2xl" dir="ltr">
              {site.phoneDisplay}
            </p>
          </a>
          <div className="rounded-[24px] border border-line bg-white p-5 sm:col-span-2 xl:col-span-1">
            <p className={arabic ? "font-arabic text-[14px] text-neutral-400" : "text-[12px] uppercase tracking-[0.16em] text-neutral-400"}>
              {t.social}
            </p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {socials.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="text-lg tracking-tight hover:text-primary">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[24px] border border-line bg-white p-5 md:mt-8 md:p-8">
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
