"use client";

import { createContext, useContext, type ReactNode } from "react";

import { defaultSiteHome, type SiteHome } from "@/lib/site-home";

const SiteHomeContext = createContext<SiteHome>(defaultSiteHome);

export function SiteHomeProvider({ value, children }: { value: SiteHome; children: ReactNode }) {
  return <SiteHomeContext.Provider value={value}>{children}</SiteHomeContext.Provider>;
}

export function useSiteHome() {
  return useContext(SiteHomeContext);
}
