import { testimonials, transformations } from "@/data/catalog";
import { defaultSiteHome, mergeSiteHome, type SiteHome } from "@/lib/site-home";
import type {
  Account,
  AuthUser,
  CheckoutResult,
  DashboardData,
  Exercise,
  MyPortalVideos,
  MyProgram,
  Package,
  Program,
  Transformation,
  Workout,
} from "@/types";

import { apiFetch } from "./client";

export { errorMessage } from "./client";

async function publicList<T>(path: string, fallback: T[]): Promise<T[]> {
  try {
    return await apiFetch<T[]>(path);
  } catch {
    return fallback;
  }
}

export async function getSiteHome(): Promise<SiteHome> {
  try {
    return mergeSiteHome(await apiFetch<SiteHome>("/site/"));
  } catch {
    return defaultSiteHome;
  }
}

export async function getPrograms(): Promise<Program[]> {
  try {
    return await apiFetch<Program[]>("/programs/");
  } catch {
    return [];
  }
}

export const getPackages = () => apiFetch<Package[]>("/packages/");
export const getGyms = () => publicList("/gyms/", []);
export const getTestimonials = () => publicList("/testimonials/", testimonials);
export const getTransformations = () => publicList("/transformations/", transformations);

export async function getPackage(slug: string) {
  try {
    return await apiFetch<Package>("/packages/" + slug);
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) return null;
    return null;
  }
}

export async function getProgram(slug: string) {
  try {
    return await apiFetch<Program>("/programs/" + slug);
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) return null;
    return null;
  }
}

export async function getTransformation(slug: string) {
  try {
    return await apiFetch<Transformation>("/transformations/" + slug);
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) return null;
    throw error;
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

export function setSession(tokens: { access: string; refresh: string; user?: AuthUser }) {
  localStorage.setItem("vb_access", tokens.access);
  localStorage.setItem("vb_refresh", tokens.refresh);
  localStorage.removeItem("vb_preview");
  if (tokens.user?.is_staff) localStorage.setItem("vb_staff", "1");
  else localStorage.removeItem("vb_staff");
  document.cookie = "vb_session=1; path=/; max-age=604800; samesite=lax";
}

export function clearSession() {
  localStorage.removeItem("vb_access");
  localStorage.removeItem("vb_refresh");
  localStorage.removeItem("vb_preview");
  localStorage.removeItem("vb_staff");
  document.cookie = "vb_session=; path=/; max-age=0; samesite=lax";
}

export async function login(email: string, password: string) {
  const data = await apiFetch<{ access: string; refresh: string; user: AuthUser }>("/auth/login/", {
    method: "POST",
    body: JSON.stringify({ email, username: email, password }),
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
  goal?: string;
  gym_id?: number | null;
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

export const getDashboard = () => apiFetch<DashboardData>("/dashboard/");
export const getMyProgram = () => apiFetch<MyProgram>("/my-program/");
export const getMyVideos = () => apiFetch<MyPortalVideos>("/my-videos/");
export const getExercises = () => apiFetch<Exercise[]>("/exercises/");
export const getWorkouts = () => apiFetch<Workout[]>("/workouts/");

export async function getWorkout(id: number) {
  try {
    return await apiFetch<Workout>("/workouts/" + id);
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) return null;
    throw error;
  }
}

export async function getExercise(slug: string) {
  try {
    return await apiFetch<Exercise>("/exercises/" + slug);
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) return null;
    throw error;
  }
}

export async function completeWorkout(scheduleId: number) {
  return apiFetch<{ status: string }>("/workouts/complete/", {
    method: "POST",
    body: JSON.stringify({ schedule_id: scheduleId }),
  });
}

export const getAccount = () => apiFetch<Account>("/account/");

export async function updateAccount(payload: Partial<Account>) {
  return apiFetch<Account>("/account/", { method: "PATCH", body: JSON.stringify(payload) });
}

export async function changePassword(current_password: string, new_password: string) {
  return apiFetch<{ detail: string }>("/account/password/", {
    method: "POST",
    body: JSON.stringify({ current_password, new_password }),
  });
}

export async function checkout(payload: {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  slug: string;
  kind: "program" | "package";
  terms_accepted: boolean;
  goal?: string;
  gym_id?: number;
}) {
  return apiFetch<CheckoutResult>("/payments/checkout/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
