"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, CircleDollarSign, LayoutDashboard, Settings, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBudgetStore } from "@/lib/store";
import { Select } from "./ui";

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: BookOpen },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/budgets", label: "Budgets", icon: CalendarDays },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div className="min-h-screen bg-[#f7f5f0] text-[#282725] dark:bg-[#171715] dark:text-[#f7f5f0]">
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-black/5 bg-[#f1eee7] px-5 py-7 dark:border-white/5 dark:bg-[#1e1e1c] lg:block">
      <Link href="/" className="mb-12 flex items-center gap-3 px-2"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#e07a5f] text-xl font-bold text-white">p</span><span className="font-display text-xl font-bold tracking-tight">pocket ledger</span></Link>
      <nav className="space-y-1">{nav.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#6c6a63] transition hover:bg-black/5 dark:text-[#bdbab1] dark:hover:bg-white/5", pathname === href && "bg-white text-[#282725] shadow-sm dark:bg-white/10 dark:text-white")}><Icon className="h-4 w-4" />{label}</Link>)}</nav>
      <div className="absolute bottom-7 left-5 right-5"><CurrencySwitcher /><Link href="/settings" className={cn("mt-3 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#6c6a63] dark:text-[#bdbab1]", pathname === "/settings" && "bg-white text-[#282725] shadow-sm dark:bg-white/10 dark:text-white")}><Settings className="h-4 w-4" />Settings</Link><div className="mt-5 flex items-center gap-2 border-t border-black/5 pt-5 text-xs text-[#858178] dark:border-white/5"><CircleDollarSign className="h-4 w-4" />Private & offline</div></div>
    </aside>
    <main className="pb-24 lg:ml-64 lg:pb-0">{children}</main>
    <div className="fixed bottom-[5.5rem] right-3 z-20 w-44 lg:hidden"><CurrencySwitcher /></div>
    <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-black/10 bg-[#f7f5f0]/95 px-2 py-2 backdrop-blur dark:border-white/10 dark:bg-[#171715]/95 lg:hidden">{[...nav, { href: "/settings", label: "Settings", icon: Settings }].map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={cn("flex flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium text-[#858178]", pathname === href && "bg-[#e07a5f]/10 text-[#c96850]")}><Icon className="h-5 w-5" />{label}</Link>)}</nav>
  </div>;
}

export function CurrencySwitcher() {
  const { settings, setSetting } = useBudgetStore();
  const currency = settings.find((setting) => setting.key === "currency")?.value ?? "TND";
  return <label className="block px-3 text-xs font-medium text-[#858178]">Currency<Select className="mt-1" value={currency} onChange={(event) => void setSetting("currency", event.target.value)}><option value="TND">TND · Tunisian dinar</option><option value="USD">$ · US dollar</option><option value="EUR">€ · Euro</option></Select></label>;
}
