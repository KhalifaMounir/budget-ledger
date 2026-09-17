import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "danger" }) {
  return <button className={cn("inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50", variant === "primary" && "bg-[#e07a5f] text-white hover:bg-[#c96850]", variant === "ghost" && "text-[#3d405b] hover:bg-black/5 dark:text-[#f7f5f0] dark:hover:bg-white/10", variant === "danger" && "bg-red-100 text-red-700 hover:bg-red-200", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none transition focus:border-[#e07a5f] focus:ring-2 focus:ring-[#e07a5f]/20 dark:border-white/10 dark:bg-white/5", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("h-11 w-full rounded-xl border border-black/10 bg-white/70 px-3 text-sm outline-none transition focus:border-[#e07a5f] dark:border-white/10 dark:bg-[#20201e]", className)} {...props} />;
}
