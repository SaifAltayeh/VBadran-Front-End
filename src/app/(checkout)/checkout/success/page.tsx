"use client";

import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/primitives";
import { useLang } from "@/lib/i18n";
import type { CheckoutResult } from "@/types";
import { formatPrice } from "@/lib/utils";

function readOrder() {
  const raw = sessionStorage.getItem("vb_order");
  return raw ? (JSON.parse(raw) as CheckoutResult) : null;
}

export default function SuccessPage() {
  const { t, arabic } = useLang();
  const order = useSyncExternalStore(
    () => () => undefined,
    readOrder,
    () => null,
  );

  return (
    <div className="mx-auto max-w-3xl py-10">
      <p className={`text-primary ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.2em]"}`}>{t.successKicker}</p>
      <h1
        className={
          arabic
            ? "mt-3 font-arabic text-[clamp(40px,6vw,80px)] font-extrabold leading-[1.15]"
            : "mt-3 font-display text-[clamp(56px,8vw,104px)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em]"
        }
      >
        {t.successTitle[0]}
        <br />
        {t.successTitle[1]}
      </h1>
      <p className={`mt-6 max-w-xl text-lg leading-8 ${arabic ? "font-arabic" : ""}`}>{t.successLead}</p>
      <p className={`mt-4 max-w-xl text-sm leading-6 text-muted ${arabic ? "font-arabic" : ""}`}>
        {order?.payment?.detail || t.successNote}
      </p>
      {order ? (
        <dl className="mt-10 grid gap-4 border-y border-line py-6 sm:grid-cols-3">
          <div>
            <dt className={`text-muted ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.16em]"}`}>{t.orderProgram}</dt>
            <dd className="mt-1">{order.title}</dd>
          </div>
          <div>
            <dt className={`text-muted ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.16em]"}`}>{t.orderNumber}</dt>
            <dd className="mt-1">{order.order_number}</dd>
          </div>
          <div>
            <dt className={`text-muted ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.16em]"}`}>{t.email}</dt>
            <dd className="mt-1">{order.email}</dd>
          </div>
          <div>
            <dt className={`text-muted ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.16em]"}`}>{t.orderAmount}</dt>
            <dd className="mt-1">{formatPrice(order.amount, order.currency)}</dd>
          </div>
        </dl>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/login" className={arabic ? "font-arabic" : undefined}>
          {t.loginAccount}
        </Button>
        <Button href="/dashboard" variant="outline" className={arabic ? "font-arabic" : undefined}>
          {t.goDashboard}
        </Button>
      </div>
    </div>
  );
}
