"use client";

import { useEffect } from "react";

import { useLang } from "@/lib/i18n";
import { useSiteHome } from "@/lib/site-home-context";
import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  wordmarkClassName,
  imageClassName,
}: {
  className?: string;
  wordmarkClassName?: string;
  imageClassName?: string;
}) {
  const { lang } = useLang();
  const brand = useSiteHome().site;
  const name = brand.brandName?.[lang] || brand.brandName?.en || "Badran";
  if (brand.logo) {
    return (
      <span className={cn("inline-flex max-w-[160px] items-center", className)}>
        {/* CMS-managed logo; remote URLs are not always known to next/image. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={brand.logo} alt={name} className={cn("h-8 w-auto max-w-full object-contain md:h-9", imageClassName)} />
      </span>
    );
  }
  return <span className={cn("font-display font-bold tracking-tight", wordmarkClassName, className)}>{name}</span>;
}

export function BrandAssets() {
  const site = useSiteHome().site;
  useEffect(() => {
    if (!site.favicon) return;
    let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = site.favicon;
  }, [site.favicon]);
  return null;
}
