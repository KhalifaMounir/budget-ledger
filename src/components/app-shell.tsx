"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, CircleDollarSign, LayoutDashboard, RefreshCw, Settings, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBudgetStore } from "@/lib/store";
import { Select } from "./ui";
import { SyncTools } from "./sync-tools";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: BookOpen },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/budgets", label: "Budgets", icon: CalendarDays },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const items = [...nav, { href: "/settings", label: "Settings", icon: Settings }];
  return <div className="min-h-screen bg-[#f5f5f7] text-[#1c1c1e] dark:bg-black dark:text-[#f5f5f7]">
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black/[.06] bg-[#f2f2f7] px-5 py-7 dark:border-white/[.08] dark:bg-[#1c1c1e] lg:block">
      <Link href="/" className="mb-12 flex items-center gap-3 px-2"><span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#007aff] text-xl font-bold text-white shadow-sm">p</span><span className="font-display text-xl font-bold tracking-tight">pocket ledger</span></Link>
      <nav className="space-y-1">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#6d6d72] transition hover:bg-black/5 dark:text-[#aeaeb2] dark:hover:bg-white/5", pathname === href && "bg-white text-[#1c1c1e] shadow-sm dark:bg-white/10 dark:text-white")}><Icon className="h-4 w-4" />{label}</Link>)}</nav>
      <div className="absolute bottom-7 left-5 right-5"><CurrencySwitcher /><Link href="/settings" className={cn("mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#6d6d72] dark:text-[#aeaeb2]", pathname === "/settings" && "bg-white text-[#1c1c1e] shadow-sm dark:bg-white/10 dark:text-white")}><Settings className="h-4 w-4" />Settings</Link><div className="mt-5 flex items-center gap-2 border-t border-black/5 pt-5 text-xs text-[#8e8e93] dark:border-white/5"><CircleDollarSign className="h-4 w-4" />Private & offline</div></div>
    </aside>
    <main className="pb-[calc(6.75rem+env(safe-area-inset-bottom))] lg:ml-64 lg:pb-0"><div className="fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-20 flex gap-2"><RefreshButton /><SyncTools /></div>{children}</main>
    <div className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4 z-20 w-44 lg:hidden"><CurrencySwitcher /></div>
    <nav aria-label="Primary navigation" className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex w-[calc(100%-1.5rem)] max-w-[30rem] -translate-x-1/2 items-center justify-between rounded-[24px] border border-white/70 bg-white/75 px-2 py-2 shadow-[0_8px_30px_rgb(0_0_0/0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#242426]/80 lg:hidden">
      {items.map(({ href, label, icon: Icon }) => { const active = pathname === href; return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={cn("relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[18px] px-1 py-2 text-[10px] font-semibold tracking-[-0.01em] text-[#8e8e93]", active && "text-[#007aff]")}><span className={cn("pointer-events-none absolute inset-x-2 top-1/2 -z-0 h-10 -translate-y-1/2 rounded-[16px] opacity-0 transition-all", active && "bg-[#007aff]/10 opacity-100 dark:bg-[#007aff]/20")} /><Icon className={cn("relative z-10 h-[21px] w-[21px] transition-transform", active && "scale-105 stroke-[2.25]")} /><span className="relative z-10">{label}</span></Link>; })}
    </nav>
  </div>;
}

function RefreshButton() {
  const { refreshFromCloud, syncing } = useBudgetStore();
  return <button title="Refresh from cloud" aria-label="Refresh from cloud" onClick={() => void refreshFromCloud()} className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-[#f7f5f0]/90 text-[#6c6a63] shadow-sm backdrop-blur hover:text-[#e07a5f] dark:border-white/10 dark:bg-[#1e1e1c]/90 dark:text-[#bdbab1]"><RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} /></button>;
}

export function CurrencySwitcher() {
  const { settings, setSetting } = useBudgetStore();
  const currency = settings.find((setting) => setting.key === "currency")?.value ?? "TND";
  return <label className="block px-3 text-xs font-medium text-[#858178]">Currency<Select className="mt-1" value={currency} onChange={(event) => void setSetting("currency", event.target.value)}><option value="TND">TND · Tunisian dinar</option><option value="USD">$ · US dollar</option><option value="EUR">€ · Euro</option></Select></label>;
}
