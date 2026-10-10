"use client";

import Link from "next/link";

import { Container, Reveal } from "@/components/ui/primitives";
import { site, socials } from "@/lib/constants/site";
import { useLang } from "@/lib/i18n";

const footerHrefs = ["/", "/about", "/programs", "/transformations", "/pricing", "/faq", "/contact"] as const;

export function Footer() {
  const { t, arabic } = useLang();
  const labels = [t.home, t.nav[0].label, t.nav[1].label, t.nav[2].label, t.nav[3].label, t.nav[4].label, t.contact];

  return (
    <footer className="bg-white">
      <Container className="grid gap-12 pb-16 pt-8 md:grid-cols-12 md:pb-20 md:pt-10">
        <div className="md:col-span-4">
          <p className="font-display text-2xl font-bold tracking-tight">VBADRAN</p>
          <p className={`mt-4 max-w-xs text-sm leading-6 text-neutral-700 ${arabic ? "font-arabic" : ""}`}>{t.footerBlurb}</p>
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
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className={`text-[11px] text-muted ${arabic ? "font-arabic" : "uppercase tracking-[0.18em]"}`}>{t.social}</p>
          <ul className="mt-4 space-y-2">
            {socials.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="text-sm hover:text-primary" target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className={`text-[11px] text-muted ${arabic ? "font-arabic" : "uppercase tracking-[0.18em]"}`}>{t.contactLabel}</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-primary">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className="hover:text-primary">
                {site.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="overflow-hidden border-t border-line px-5 md:px-10">
        <Reveal>
          <p className="font-display text-[clamp(42px,18vw,250px)] font-extrabold leading-[0.78] tracking-[-0.06em]">
            VBADRAN
          </p>
        </Reveal>
      </div>
      <Container className={`flex flex-col gap-2 py-6 text-xs text-muted sm:flex-row sm:justify-between ${arabic ? "font-arabic" : ""}`}>
        <p>© {new Date().getFullYear()} VBADRAN</p>
        <p>{t.footerTag}</p>
      </Container>
    </footer>
  );
}
