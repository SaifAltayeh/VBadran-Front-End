"use client";

import {
  CalendarDays,
  ChartNoAxesColumn,
  Dumbbell,
  House,
  Library,
  LogOut,
  Menu,
  Salad,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { LanguageToggle, useLang } from "@/lib/i18n";
import { clearSession } from "@/lib/api";
import { cn } from "@/lib/utils";

const hrefs = [
  { href: "/dashboard", key: "overview", icon: House },
  { href: "/dashboard/program", key: "program", icon: Dumbbell },
  { href: "/dashboard/training", key: "training", icon: CalendarDays },
  { href: "/dashboard/exercises", key: "exercises", icon: Library },
  { href: "/dashboard/nutrition", key: "nutrition", icon: Salad },
  { href: "/dashboard/progress", key: "progress", icon: ChartNoAxesColumn },
  { href: "/dashboard/account", key: "account", icon: UserRound },
] as const;

function active(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { t, arabic } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const links = hrefs.map((item) => ({ ...item, label: t.dash[item.key] }));
  const current = links.find((item) => active(pathname, item.href)) ?? links[0];

  function logout() {
    clearSession();
    router.push("/");
  }

  const nav = (
    <nav className="flex h-full flex-col" aria-label="Dashboard">
      <Link href="/" className="px-2 font-display text-lg font-bold tracking-tight">
        VBADRAN
      </Link>
      <p className={`mt-1 px-2 text-neutral-400 ${arabic ? "font-arabic text-sm" : "text-[11px] uppercase tracking-[0.16em]"}`}>
        {t.dash.platform}
      </p>
      <ul className="mt-8 space-y-1">
        {links.map((item) => {
          const on = active(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                  arabic && "font-arabic",
                  on ? "bg-primary text-white" : "text-neutral-500 hover:bg-white hover:text-black",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        onClick={logout}
        className={`mt-auto flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm text-neutral-500 hover:bg-white hover:text-black ${arabic ? "font-arabic" : ""}`}
      >
        <LogOut className="h-4 w-4" /> {t.dash.logout}
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#f4f5f7] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="hidden p-4 lg:block">
        <div className="sticky top-4 flex h-[calc(100svh-2rem)] flex-col rounded-[28px] bg-[#eef0f3] p-5">{nav}</div>
      </aside>
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between px-5 lg:h-20 lg:px-8">
          <div className="min-w-0">
            <Link href="/" className="font-display font-bold tracking-tight lg:hidden">
              VBADRAN
            </Link>
            <p className={`hidden truncate lg:block ${arabic ? "font-arabic text-xl font-semibold" : "font-display text-2xl tracking-tight"}`}>
              {current.label}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white lg:hidden" aria-label={t.openMenu} onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>
        {open ? (
          <div className="fixed inset-0 z-50 bg-[#f4f5f7] p-4 lg:hidden">
            <div className="flex h-full flex-col rounded-[28px] bg-[#eef0f3] p-5">
              <button type="button" className="mb-4 self-end" aria-label={t.closeMenu} onClick={() => setOpen(false)}>
                <X />
              </button>
              {nav}
            </div>
          </div>
        ) : null}
        <div className="flex-1 px-4 pb-28 lg:px-8 lg:pb-10">{children}</div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-white/80 bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Mobile">
        {[links[0], links[2], links[4], links[5]].map((item) => {
          const Icon = item.icon;
          const on = active(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex flex-col items-center gap-1 py-2.5 text-[10px]", arabic && "font-arabic", on ? "text-primary" : "text-neutral-500")}
            >
              <Icon className="h-4 w-4" />
              {item.label.split(" ")[0]}
            </Link>
          );
        })}
        <button type="button" onClick={() => setOpen(true)} className={`flex flex-col items-center gap-1 py-2.5 text-[10px] text-neutral-500 ${arabic ? "font-arabic" : ""}`}>
          <Menu className="h-4 w-4" />
          {t.dash.more}
        </button>
      </nav>
    </div>
  );
}
