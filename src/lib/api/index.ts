import { findPackage, findProgram, findTransformation, packages, programs, testimonials, transformations } from "@/data/catalog";
import { exercises, findExercise, findWorkout, mockAccount, mockDashboard, mockMessages, mockNutrition, mockProgram, mockProgress, workouts } from "@/data/platform";
import type { Account, AuthUser, CheckoutResult, DashboardData, MessageThread, MyProgram, NutritionPlan, ProgressEntry, ProgressPhoto } from "@/types";

import { apiFetch, isNetworkError, isPreview, withFallback } from "./client";

export { errorMessage, isPreview } from "./client";

async function publicList<T>(path: string, fallback: T[]): Promise<T[]> {
  try {
    return await apiFetch<T[]>(path);
  } catch (error) {
    if (isNetworkError(error)) return fallback;
    throw error;
  }
}

export const getPrograms = () => publicList("/programs/", programs);
export const getPackages = () => publicList("/packages/", packages);
export const getTestimonials = () => publicList("/testimonials/", testimonials);
export const getTransformations = () => publicList("/transformations/", transformations);

export async function getProgram(slug: string) {
  try {
    return await apiFetch<Awaited<ReturnType<typeof findProgram>>>("/programs/" + slug);
  } catch (error) {
    if (isNetworkError(error)) return findProgram(slug);
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) return null;
    return findProgram(slug);
  }
}

export async function getTransformation(slug: string) {
  try {
    return await apiFetch<NonNullable<ReturnType<typeof findTransformation>>>("/transformations/" + slug);
  } catch (error) {
    if (isNetworkError(error)) return findTransformation(slug);
    return findTransformation(slug);
  }
}

export async function submitInquiry(payload: {
  name: string;
  email: string;
  phone: string;
  goal: string;
  fitness_level: string;
  program: string;
  message: string;
}) {
  return apiFetch<{ detail: string }>("/contact/", { method: "POST", body: JSON.stringify(payload) });
}

export function setSession(tokens: { access: string; refresh: string }) {
  localStorage.setItem("vb_access", tokens.access);
  localStorage.setItem("vb_refresh", tokens.refresh);
  localStorage.removeItem("vb_preview");
  document.cookie = "vb_session=1; path=/; max-age=604800; samesite=lax";
}

export function setPreviewSession() {
  localStorage.removeItem("vb_access");
  localStorage.removeItem("vb_refresh");
  localStorage.setItem("vb_preview", "1");
  document.cookie = "vb_session=1; path=/; max-age=604800; samesite=lax";
}

export function clearSession() {
  localStorage.removeItem("vb_access");
  localStorage.removeItem("vb_refresh");
  localStorage.removeItem("vb_preview");
  document.cookie = "vb_session=; path=/; max-age=0; samesite=lax";
}

export async function login(email: string, password: string) {
  const data = await apiFetch<{ access: string; refresh: string; user: AuthUser }>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setSession(data);
  return data.user;
}

export async function register(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
}) {
  return apiFetch("/auth/register/", { method: "POST", body: JSON.stringify(payload) });
}

export async function requestPasswordReset(email: string) {
  return apiFetch<{ detail: string }>("/auth/password-reset/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmPasswordReset(payload: { uid: string; token: string; password: string }) {
  return apiFetch<{ detail: string }>("/auth/password-reset/confirm/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export const getDashboard = () => withFallback<DashboardData>("/dashboard/", mockDashboard);
export const getMyProgram = () => withFallback<MyProgram>("/my-program/", mockProgram);
export const getNutrition = () => withFallback<{ plan: NutritionPlan | null }>("/nutrition/", mockNutrition);
export const getExercises = () => withFallback("/exercises/", () => exercises);
export const getWorkouts = () => withFallback("/workouts/", () => workouts);

export async function getWorkout(id: number) {
  if (isPreview()) return findWorkout(id);
  try {
    return await apiFetch<NonNullable<ReturnType<typeof findWorkout>>>("/workouts/" + id);
  } catch (error) {
    if (isNetworkError(error)) return findWorkout(id);
    throw error;
  }
}

export async function getExercise(slug: string) {
  if (isPreview()) return findExercise(slug);
  try {
    return await apiFetch<NonNullable<ReturnType<typeof findExercise>>>("/exercises/" + slug);
  } catch (error) {
    if (isNetworkError(error)) return findExercise(slug);
    throw error;
  }
}

export async function completeWorkout(scheduleId: number) {
  if (isPreview()) return { status: "completed" as const };
  return apiFetch<{ status: string }>("/workouts/complete/", {
    method: "POST",
    body: JSON.stringify({ schedule_id: scheduleId }),
  });
}

export const getProgress = () => withFallback<ProgressEntry[]>("/progress/", mockProgress);
export const getMessages = () => withFallback<MessageThread>("/messages/", mockMessages);
export const getAccount = () => withFallback<Account>("/account/", mockAccount);

export async function sendMessage(body: string) {
  if (isPreview()) {
    return { id: Date.now(), body, is_coach: false, created_at: new Date().toISOString() };
  }
  return apiFetch<MessageThread["messages"][number]>("/messages/", {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export async function updateAccount(payload: Partial<Account>) {
  if (isPreview()) return { ...mockAccount(), ...payload };
  return apiFetch<Account>("/account/", { method: "PATCH", body: JSON.stringify(payload) });
}

export async function changePassword(current_password: string, new_password: string) {
  if (isPreview()) return { detail: "Password updated in preview only." };
  return apiFetch<{ detail: string }>("/account/password/", {
    method: "POST",
    body: JSON.stringify({ current_password, new_password }),
  });
}

export async function addProgress(payload: Partial<ProgressEntry>) {
  if (isPreview()) return { id: Date.now(), notes: "", date: payload.date || "", ...payload } as ProgressEntry;
  return apiFetch<ProgressEntry>("/progress/", { method: "POST", body: JSON.stringify(payload) });
}

export async function checkout(payload: {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  slug: string;
  kind: "program" | "package";
  terms_accepted: boolean;
}) {
  const product = payload.kind === "package" ? findPackage(payload.slug) : findProgram(payload.slug);
  try {
    return await apiFetch<CheckoutResult>("/payments/checkout/", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (!isNetworkError(error) || !product) throw error;
    return {
      order_number: "VB-PREVIEW",
      title: "name" in product ? product.name : product.title,
      email: payload.email,
      full_name: payload.full_name,
      amount: product.price,
      currency: product.currency,
      status: "pending",
      payment: {
        provider: "unconfigured",
        status: "pending",
        detail: "No card was charged. Connect a payment provider to capture payment and open access.",
      },
    } satisfies CheckoutResult;
  }
}

export async function uploadProgressPhoto(file: File, caption: string) {
  if (isPreview()) {
    return { id: Date.now(), url: URL.createObjectURL(file), caption, date: new Date().toISOString().slice(0, 10) } satisfies ProgressPhoto;
  }
  const body = new FormData();
  body.set("image", file);
  body.set("caption", caption);
  body.set("date", new Date().toISOString().slice(0, 10));
  return apiFetch<ProgressPhoto>("/progress-photos/", { method: "POST", body });
}
