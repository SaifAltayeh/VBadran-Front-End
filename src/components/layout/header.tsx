"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/primitives";
import { LanguageToggle, useLang } from "@/lib/i18n";
import { cn, ease } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { t, arabic } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const y = window.scrollY;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, y);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const menu = (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease }}
          className="fixed inset-x-0 bottom-0 top-[calc(4rem+env(safe-area-inset-top))] z-[55] overflow-y-auto bg-white xl:hidden"
        >
          <nav
            className="flex min-h-full flex-col justify-between px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1">
              {t.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn("py-2.5 font-display text-[clamp(32px,10vw,44px)] leading-[1.1] tracking-tight", arabic && "font-arabic")}
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
  );

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] border-b bg-white pt-[env(safe-area-inset-top)] transition-[background-color,border-color] duration-300",
          "h-[calc(4rem+env(safe-area-inset-top))] md:h-[calc(5rem+env(safe-area-inset-top))]",
          scrolled || open ? "border-line" : "border-transparent md:bg-transparent",
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-2 px-4 md:h-full md:gap-3 md:px-10">
          <Link href="/" className="min-w-0 truncate font-display text-base font-bold tracking-[-0.04em] sm:text-lg" aria-label="VBADRAN home">
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
          <div className="flex shrink-0 items-center gap-1.5 xl:hidden">
            <LanguageToggle />
            <button
              type="button"
              className="relative z-[70] inline-flex h-11 w-11 shrink-0 items-center justify-center text-black"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.closeMenu : t.openMenu}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      {mounted ? createPortal(menu, document.body) : null}
    </>
  );
}
