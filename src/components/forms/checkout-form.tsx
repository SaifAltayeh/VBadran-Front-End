"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button, Field } from "@/components/ui/primitives";
import { checkout, errorMessage } from "@/lib/api";
import { useLang } from "@/lib/i18n";
import { formatPrice } from "@/lib/utils";

export function CheckoutForm({
  slug,
  kind,
  title,
  price,
  currency,
  duration,
}: {
  slug: string;
  kind: "program" | "package";
  title: string;
  price: string;
  currency: string;
  duration: number;
}) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

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
        <fieldset className="border border-line p-5">
          <legend className={`px-2 text-muted ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.18em]"}`}>{t.paymentMethod}</legend>
          <div className="mb-4 flex gap-2 text-xs uppercase tracking-[0.14em]">
            <span className="border border-line px-3 py-2">Visa</span>
            <span className="border border-line px-3 py-2">Mastercard</span>
          </div>
          <div className="grid gap-4">
            <label className={`block text-sm ${arabic ? "font-arabic" : ""}`}>
              {t.nameOnCard}
              <input value={cardName} onChange={(event) => setCardName(event.target.value)} autoComplete="cc-name" className="mt-2 h-12 w-full border border-line px-3" />
            </label>
            <label className={`block text-sm ${arabic ? "font-arabic" : ""}`}>
              {t.cardNumber}
              <input value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} inputMode="numeric" autoComplete="cc-number" className="mt-2 h-12 w-full border border-line px-3" placeholder={t.cardStay} />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`block text-sm ${arabic ? "font-arabic" : ""}`}>
                {t.expiry}
                <input value={expiry} onChange={(event) => setExpiry(event.target.value)} autoComplete="cc-exp" className="mt-2 h-12 w-full border border-line px-3" placeholder="MM / YY" />
              </label>
              <label className="block text-sm">
                CVC
                <input value={cvc} onChange={(event) => setCvc(event.target.value)} autoComplete="cc-csc" className="mt-2 h-12 w-full border border-line px-3" />
              </label>
            </div>
          </div>
          <p className={`mt-4 text-xs leading-5 text-muted ${arabic ? "font-arabic" : ""}`}>
            {t.cardNote}
          </p>
        </fieldset>
        <label className={`flex items-start gap-3 text-sm ${arabic ? "font-arabic" : ""}`}>
          <input name="terms" type="checkbox" required className="mt-1" />
          <span>{t.terms}</span>
        </label>
        {error ? <p role="alert" className="text-sm text-primary">{error}</p> : null}
        <div>
          <Button type="submit" disabled={pending} arrow={false} className={arabic ? "font-arabic" : undefined}>
            {pending ? t.savingOrder : t.continue}
          </Button>
        </div>
      </div>
      <aside className="h-fit border border-line p-6 lg:col-span-5">
        <p className={`text-muted ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.18em]"}`}>{t.yourSelection}</p>
        <h2 className="mt-3 font-display text-4xl">{title}</h2>
        <p className={`mt-2 text-sm text-muted ${arabic ? "font-arabic" : ""}`}>{duration} {t.weeks}</p>
        <p className="mt-6 font-display text-5xl">{formatPrice(price, currency)}</p>
      </aside>
    </form>
  );
}
