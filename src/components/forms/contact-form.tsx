"use client";

import { FormEvent, useState } from "react";

import { Button, Field, SelectField, TextArea } from "@/components/ui/primitives";
import { errorMessage, submitInquiry } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import { pickLocale } from "@/lib/locale";
import { useSiteHome } from "@/lib/site-home-context";
import type { Program } from "@/types";

const PACKAGE_OPTIONS = [
  { slug: "spark", title: "Spark", title_ar: "سبارك" },
  { slug: "platinum", title: "Platinum", title_ar: "بلاتينوم" },
  { slug: "oxygen", title: "Oxygen", title_ar: "أوكسجين" },
];

export function ContactForm({ programs }: { programs?: Program[] }) {
  const { t, lang, arabic } = useLang();
  const copy = t.contactPage;
  const page = useSiteHome().pages.contact;
  const options = programs?.length ? programs : PACKAGE_OPTIONS;
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("loading");
    try {
      await submitInquiry({
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
        goal: String(form.get("goal") || ""),
        fitness_level: String(form.get("fitness_level") || ""),
        program: String(form.get("program") || ""),
        message: String(form.get("message") || ""),
      });
      setStatus("sent");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(errorMessage(error, t.inquiryError));
    }
  }

  const labelClass = arabic ? "font-arabic text-[15px]" : undefined;

  if (status === "sent") {
    return (
      <div role="status">
        <h2 className={arabic ? "font-arabic text-3xl" : "font-display text-3xl tracking-tight md:text-4xl"}>{page.received[lang] || copy.received}</h2>
        <p className={`mt-3 text-subtitle ${arabic ? "font-arabic" : ""}`}>{page.receivedBody[lang] || copy.receivedBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={copy.name} name="name" required autoComplete="name" labelClassName={labelClass} />
        <Field label={copy.email} name="email" type="email" required autoComplete="email" labelClassName={labelClass} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={copy.phone} name="phone" autoComplete="tel" labelClassName={labelClass} />
        <SelectField label={copy.fitness} name="fitness_level" defaultValue="beginner" labelClassName={labelClass}>
          <option value="beginner">{copy.beginner}</option>
          <option value="intermediate">{copy.intermediate}</option>
          <option value="advanced">{copy.advanced}</option>
          <option value="returning">{copy.returning}</option>
        </SelectField>
      </div>
      <Field label={copy.goal} name="goal" required placeholder={copy.goalPh} labelClassName={labelClass} />
      <SelectField label={copy.preferred} name="program" labelClassName={labelClass}>
        {options.map((program) => (
          <option key={program.slug} value={program.title}>
            {pickLocale(program.title, program.title_ar, lang)}
          </option>
        ))}
      </SelectField>
      <TextArea label={copy.message} name="message" required labelClassName={labelClass} />
      {status === "error" ? (
        <p className={`text-sm text-primary ${arabic ? "font-arabic" : ""}`} role="alert">
          {message}
        </p>
      ) : null}
      <div>
        <Button type="submit" disabled={status === "loading"} arrow={false} className={`w-full sm:w-auto ${arabic ? "font-arabic" : ""}`}>
          {status === "loading" ? copy.sending : page.send[lang] || copy.send}
        </Button>
      </div>
    </form>
  );
}
