"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/primitives";
import { LanguageToggle, useLang } from "@/lib/i18n";
import { cn, ease } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { t, arabic } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background-color,height,border-color] duration-300",
        scrolled || open
          ? "h-[calc(4rem+env(safe-area-inset-top))] border-b border-line bg-white/85 backdrop-blur-md"
          : "h-[calc(4rem+env(safe-area-inset-top))] border-b border-transparent bg-white md:h-[calc(5rem+env(safe-area-inset-top))] md:bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between px-5 md:h-full md:px-10">
        <Link href="/" className="font-display text-lg font-bold tracking-[-0.04em]" aria-label="VBADRAN home">
          VBADRAN
        </Link>
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Primary">
          {t.nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn("text-sm tracking-tight", arabic && "font-arabic", active ? "text-black" : "text-neutral-600 hover:text-black")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-4 xl:flex">
          <LanguageToggle />
          <Link href="/contact" className={cn("text-sm", arabic && "font-arabic")}>
            {t.contact}
          </Link>
          <Link href="/login" className={cn("text-sm", arabic && "font-arabic")}>
            {t.login}
          </Link>
          <Button href="/programs" className={cn("px-5 py-3", arabic && "font-arabic")}>
            {t.startProgram}
          </Button>
        </div>
        <div className="flex items-center gap-2 xl:hidden">
          <LanguageToggle />
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-black"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.closeMenu : t.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease }}
            className="fixed inset-x-0 bottom-0 top-[calc(4rem+env(safe-area-inset-top))] z-50 overflow-y-auto bg-white xl:hidden"
          >
            <nav className="flex min-h-full flex-col justify-between px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]" aria-label="Mobile">
              <div className="flex flex-col gap-1">
                {t.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn("py-2 font-display text-[clamp(32px,10vw,44px)] tracking-tight", arabic && "font-arabic")}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/contact" onClick={() => setOpen(false)} className={cn("mt-4 py-2 text-lg", arabic && "font-arabic")}>
                  {t.contact}
                </Link>
                <Link href="/login" onClick={() => setOpen(false)} className={cn("py-2 text-lg", arabic && "font-arabic")}>
                  {t.login}
                </Link>
              </div>
              <Button href="/programs" className={cn("mt-8 w-full", arabic && "font-arabic")}>
                {t.startProgram}
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
