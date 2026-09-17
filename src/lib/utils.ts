import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CurrencyCode } from "./types";

let activeCurrency: CurrencyCode = "TND";

export function setActiveCurrency(currency: CurrencyCode) {
  activeCurrency = currency;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "item") {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function formatCurrency(value: number, currency = activeCurrency) {
  return new Intl.NumberFormat(currency === "TND" ? "fr-TN" : "en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}

export function monthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}
