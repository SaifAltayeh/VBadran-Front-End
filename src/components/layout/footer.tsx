"use client";

import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { Container, Reveal } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { useSiteHome } from "@/lib/site-home-context";

const footerHrefs = ["/", "/about", "/programs", "/transformations", "/faq", "/contact"] as const;

export function Footer() {
  const { t, lang, arabic } = useLang();
  const cms = useSiteHome();
  const info = cms.site;
  const labels = [t.home, t.nav[0].label, t.nav[1].label, t.nav[2].label, t.nav[3].label, t.contact];
  const email = info.email || "";
  const phone = info.phoneDisplay || "";
  const phoneHref = info.phoneHref || (phone ? `tel:${phone.replace(/\s+/g, "")}` : "");
  const links = (info.socials || []).filter((item) => item.href);
  const blurb = info.footerBlurb[lang] || "";
  const tag = info.footerTag[lang] || "";

  return (
    <footer className="bg-background">
      <Container className="grid gap-12 pb-16 pt-8 md:grid-cols-12 md:pb-20 md:pt-10">
        <div className="md:col-span-4">
          <BrandMark wordmarkClassName="text-2xl" />
          {blurb ? <p className={`mt-4 max-w-xs text-sm leading-6 text-subtitle ${arabic ? "font-arabic" : ""}`}>{blurb}</p> : null}
        </div>
        <div className="md:col-span-3">
          <p className={`text-[11px] text-muted ${arabic ? "font-arabic" : "uppercase tracking-[0.18em]"}`}>{t.pages}</p>
          <ul className="mt-4 space-y-2">
            {footerHrefs.map((href, index) => (
              <li key={href}>
                <Link href={href} className={`text-sm hover:text-primary ${arabic ? "font-arabic" : ""}`}>
                  {labels[index]}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/terms" className={`text-sm hover:text-primary ${arabic ? "font-arabic" : ""}`}>
                {cms.pages.terms.title[lang] || (arabic ? "الشروط والأحكام" : "Terms")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={`text-sm hover:text-primary ${arabic ? "font-arabic" : ""}`}>
                {cms.pages.privacy.title[lang] || (arabic ? "سياسة الخصوصية" : "Privacy")}
              </Link>
            </li>
          </ul>
        </div>
        {links.length ? (
          <div className="md:col-span-2">
            <p className={`text-[11px] text-muted ${arabic ? "font-arabic" : "uppercase tracking-[0.18em]"}`}>{t.social}</p>
            <ul className="mt-4 space-y-2">
              {links.map((item) => (
                <li key={item.label || item.href}>
                  <a href={item.href} className="text-sm hover:text-primary" target="_blank" rel="noreferrer">
                    {item.label || item.href}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {email || phone ? (
          <div className="md:col-span-3">
            <p className={`text-[11px] text-muted ${arabic ? "font-arabic" : "uppercase tracking-[0.18em]"}`}>{t.contactLabel}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {email ? (
                <li>
                  <a href={`mailto:${email}`} className="hover:text-primary">
                    {email}
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li>
                  <a href={phoneHref || undefined} className="hover:text-primary" dir="ltr">
                    {phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
      </Container>
      <div className="overflow-hidden border-t border-line px-5 md:px-10">
        <Reveal>
          <p className="font-display text-[clamp(36px,16vw,250px)] font-extrabold leading-[0.78] tracking-[-0.06em]">
            {info.brandName[lang] || info.brandName.en || "Badran"}
          </p>
        </Reveal>
      </div>
      <Container className={`flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:justify-between ${arabic ? "font-arabic" : ""}`}>
        <p>© {new Date().getFullYear()} {info.brandName[lang] || info.brandName.en || "Badran"}</p>
        {tag ? <p>{tag}</p> : null}
      </Container>
    </footer>
  );
}
