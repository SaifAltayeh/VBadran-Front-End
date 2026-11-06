"use client";

import { Container } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import { useSiteHome } from "@/lib/site-home-context";

export function LegalContent({ kind }: { kind: "terms" | "privacy" }) {
  const { lang, arabic } = useLang();
  const page = useSiteHome().pages[kind];
  const title = page.title[lang] || page.title.en;
  const body = page.body[lang] || page.body.en;
  const pending =
    lang === "ar"
      ? "المحتوى القانوني بانتظار اعتماد العميل. لا تستخدم هذا النص كسياسة معتمدة."
      : "Legal copy is pending client approval. This page is a placeholder, not an approved policy.";

  return (
    <section className="pb-20 pt-10 md:pb-24 md:pt-16">
      <Container className="max-w-3xl">
        <h1
          className={
            arabic
              ? "font-arabic text-[clamp(32px,6vw,56px)] font-extrabold leading-[1.2]"
              : "font-display text-[clamp(36px,6vw,64px)] font-medium tracking-[-0.04em]"
          }
        >
          {title}
        </h1>
        {body.trim() ? (
          <div className={`mt-8 whitespace-pre-wrap text-base leading-8 text-subtitle ${arabic ? "font-arabic" : ""}`}>{body}</div>
        ) : (
          <p className={`mt-8 rounded-[20px] border border-line bg-card p-5 text-subtitle ${arabic ? "font-arabic" : ""}`}>{pending}</p>
        )}
      </Container>
    </section>
  );
}
