"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button, Field } from "@/components/ui/primitives";
import { confirmPasswordReset, errorMessage, login, register, requestPasswordReset, setPreviewSession } from "@/lib/api";
import { useLang } from "@/lib/i18n";

export function LoginForm() {
  const { t, arabic } = useLang();
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      await login(String(form.get("email")), String(form.get("password")));
      router.push(params.get("next") || "/dashboard");
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <Field label={t.email} name="email" type="email" required autoComplete="email" />
      <Field label={t.password} name="password" type="password" required autoComplete="current-password" />
      {error ? <p className="text-sm text-primary" role="alert">{error}</p> : null}
      <Button type="submit" disabled={pending} arrow={false} className={arabic ? "font-arabic" : undefined}>
        {pending ? t.signingIn : t.login}
      </Button>
      <div className={`flex flex-wrap justify-between gap-3 text-sm ${arabic ? "font-arabic" : ""}`}>
        <Link href="/forgot-password" className="underline-offset-4 hover:underline">{t.forgot}</Link>
        <Link href="/register" className="underline-offset-4 hover:underline">{t.createAccount}</Link>
      </div>
      <button
        type="button"
        className={`text-start text-sm text-muted underline-offset-4 hover:underline ${arabic ? "font-arabic" : ""}`}
        onClick={() => {
          setPreviewSession();
          router.push("/dashboard");
        }}
      >
        {t.preview}
      </button>
    </form>
  );
}

export function RegisterForm() {
  const { t, arabic } = useLang();
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) {
      setError(t.mismatch);
      return;
    }
    setPending(true);
    setError("");
    try {
      await register({
        first_name: String(form.get("first_name")),
        last_name: String(form.get("last_name")),
        email: String(form.get("email")),
        phone: String(form.get("phone") || ""),
        password,
      });
      await login(String(form.get("email")), password);
      router.push("/dashboard");
    } catch (err) {
      setError(errorMessage(err));
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.firstName} name="first_name" required />
        <Field label={t.lastName} name="last_name" />
      </div>
      <Field label={t.email} name="email" type="email" required />
      <Field label={t.phone} name="phone" />
      <Field label={t.password} name="password" type="password" required minLength={8} />
      <Field label={t.confirmPassword} name="confirm" type="password" required minLength={8} />
      {error ? <p className="text-sm text-primary" role="alert">{error}</p> : null}
      <Button type="submit" disabled={pending} arrow={false} className={arabic ? "font-arabic" : undefined}>
        {pending ? t.creating : t.create}
      </Button>
      <Link href="/login" className={`text-sm underline-offset-4 hover:underline ${arabic ? "font-arabic" : ""}`}>{t.already}</Link>
    </form>
  );
}

export function ForgotForm() {
  const { t, arabic } = useLang();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email"));
    setError("");
    try {
      const result = await requestPasswordReset(email);
      setMessage(result.detail);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <Field label={t.email} name="email" type="email" required />
      {message ? <p role="status" className="text-sm">{message}</p> : null}
      {error ? <p role="alert" className="text-sm text-primary">{error}</p> : null}
      <Button type="submit" arrow={false} className={arabic ? "font-arabic" : undefined}>{t.sendReset}</Button>
    </form>
  );
}

export function ResetForm({ uid, token }: { uid: string; token: string }) {
  const { t, arabic } = useLang();
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const password = String(new FormData(event.currentTarget).get("password"));
    const confirm = String(new FormData(event.currentTarget).get("confirm"));
    if (password !== confirm) {
      setError(t.mismatch);
      return;
    }
    try {
      await confirmPasswordReset({ uid, token, password });
      router.push("/login");
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  if (!uid || !token) {
    return <p className={arabic ? "font-arabic" : undefined}>{t.resetIncomplete}</p>;
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <Field label={t.newPassword} name="password" type="password" required minLength={8} />
      <Field label={t.confirmPassword} name="confirm" type="password" required minLength={8} />
      {error ? <p role="alert" className="text-sm text-primary">{error}</p> : null}
      <Button type="submit" arrow={false} className={arabic ? "font-arabic" : undefined}>{t.updatePassword}</Button>
    </form>
  );
}
