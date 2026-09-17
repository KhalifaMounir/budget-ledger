"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { useBudgetStore } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useBudgetStore((state) => state.hydrate);
  useEffect(() => { void hydrate(); }, [hydrate]);
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem>{children}</ThemeProvider>;
}
