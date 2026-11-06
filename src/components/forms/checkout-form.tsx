"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button, Field, SelectField } from "@/components/ui/primitives";
import { checkout, errorMessage } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import { FITNESS_GOALS } from "@/lib/goals";
import { formatDuration, pickLocale } from "@/lib/locale";
import { formatPrice } from "@/lib/utils";
import type { Gym } from "@/types";

export function CheckoutForm({
  slug,
  kind,
  title,
  titleAr,
  price,
  currency,
  duration,
  image,
  gym,
  gyms = [],
}: {
  slug: string;
  kind: "program" | "package";
  title: string;
  titleAr?: string;
  price: string;
  currency: string;
  duration: number | null;
  image?: string;
  gym?: Gym | null;
  gyms?: Gym[];
}) {
  const { t, lang, arabic } = useLang();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const lockedGym = gym || null;
  const displayTitle = pickLocale(title, titleAr, lang);
  const durationLabel = formatDuration(duration, t.weeks);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!form.get("terms")) {
      setError(t.acceptTerms);
      return;
    }
    setPending(true);
    setError("");
    try {
      const order = await checkout({
        full_name: String(form.get("full_name")),
        email: String(form.get("email")),
        phone: String(form.get("phone") || ""),
        country: String(form.get("country") || ""),
        slug,
        kind,
        terms_accepted: true,
        goal: String(form.get("goal") || ""),
        gym_id: lockedGym?.id || Number(form.get("gym_id") || 0) || undefined,
      });
      sessionStorage.setItem("vb_order", JSON.stringify(order));
      router.push("/checkout/success");
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-12">
      <div className="grid gap-5 lg:col-span-7">
        <Field label={t.contactPage.name} name="full_name" required autoComplete="name" />
        <Field label={t.email} name="email" type="email" required autoComplete="email" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.phone} name="phone" autoComplete="tel" />
          <Field label={t.country} name="country" autoComplete="country-name" />
        </div>
        {lockedGym ? (
          <p className={`rounded-xl border border-line bg-card px-4 py-3 text-sm ${arabic ? "font-arabic" : ""}`}>
            {pickLocale(lockedGym.name, lockedGym.name_ar, lang)}
          </p>
        ) : (
          <SelectField label={arabic ? "الصالة" : "Gym"} name="gym_id" required>
            <option value="">{arabic ? "اختر الصالة" : "Choose a gym"}</option>
            {gyms.map((item) => (
              <option key={item.id} value={item.id}>
                {pickLocale(item.name, item.name_ar, lang)}
              </option>
            ))}
          </SelectField>
        )}
        <SelectField label={arabic ? "الهدف" : "Fitness goal"} name="goal" required>
          <option value="">{arabic ? "اختر الهدف" : "Choose a goal"}</option>
          {FITNESS_GOALS.map((goal) => (
            <option key={goal.value} value={goal.value}>
              {arabic ? goal.ar : goal.en}
            </option>
          ))}
        </SelectField>
        <div className="rounded-[20px] border border-line bg-card p-5">
          <p className={`text-sm font-medium ${arabic ? "font-arabic" : ""}`}>
            {arabic ? "الدفع الإلكتروني غير مفعّل" : "Online payment is not active"}
          </p>
          <p className={`mt-2 text-sm leading-6 text-subtitle ${arabic ? "font-arabic" : ""}`}>
            {arabic
              ? "تكامل Upay / KNET غير منفّذ بعد. هذا النموذج يحفظ طلباً معلّقاً فقط ولا يخصم أي مبلغ ولا يفعّل الاشتراك."
              : "UPAY / KNET INTEGRATION: NOT IMPLEMENTED — PENDING API DOCUMENTATION. This form stores a pending order only. It does not charge a card or open membership access."}
          </p>
        </div>
        <label className={`flex items-start gap-3 text-sm ${arabic ? "font-arabic" : ""}`}>
          <input name="terms" type="checkbox" required className="mt-1" />
          <span>
            {arabic ? "أوافق على" : "I agree to the"}{" "}
            <Link href="/terms" className="underline underline-offset-4">
              {arabic ? "الشروط والأحكام" : "Terms & Conditions"}
            </Link>
            . {arabic ? "الوصول يُفتح بعد تأكيد الدفع الحقيقي." : "Access opens only after a real payment is confirmed."}
          </span>
        </label>
        {error ? (
          <p role="alert" className="text-sm text-primary">
            {error}
          </p>
        ) : null}
        <div>
          <Button type="submit" disabled={pending} arrow={false} className={arabic ? "font-arabic" : undefined}>
            {pending ? t.savingOrder : arabic ? "حفظ الطلب المعلّق" : "Save pending order"}
          </Button>
        </div>
      </div>
      <aside className="h-fit border border-line bg-card p-6 lg:col-span-5">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={displayTitle} className="mb-4 aspect-[16/10] w-full rounded-[16px] object-cover" />
        ) : null}
        <p className={`text-muted ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.18em]"}`}>{t.yourSelection}</p>
        <h2 className="mt-3 font-display text-4xl">{displayTitle}</h2>
        {durationLabel ? <p className={`mt-2 text-sm text-muted ${arabic ? "font-arabic" : ""}`}>{durationLabel}</p> : null}
        <p className="mt-6 font-display text-5xl">{formatPrice(price, currency, lang)}</p>
      </aside>
    </form>
  );
}
