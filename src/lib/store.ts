"use client";

import { create } from "zustand";
import { db } from "./db";
import { uid } from "./utils";
import type { Budget, Category, ExportPayload, Setting, Transaction, TransactionType } from "./types";

const starterCategories: Category[] = [
  { id: "cat_food", name: "Food & dining", icon: "Utensils", color: "#e07a5f", type: "expense", createdAt: new Date().toISOString() },
  { id: "cat_home", name: "Home", icon: "House", color: "#5b8e7d", type: "expense", createdAt: new Date().toISOString() },
  { id: "cat_transport", name: "Transport", icon: "Car", color: "#f2cc8f", type: "expense", createdAt: new Date().toISOString() },
  { id: "cat_fun", name: "Fun & leisure", icon: "Sparkles", color: "#81b29a", type: "expense", createdAt: new Date().toISOString() },
  { id: "cat_salary", name: "Salary", icon: "BriefcaseBusiness", color: "#3d405b", type: "income", createdAt: new Date().toISOString() },
];

interface BudgetState {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  settings: Setting[];
  ready: boolean;
  hydrate: () => Promise<void>;
  addTransaction: (input: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTransaction: (id: string, input: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (input: Omit<Category, "id" | "createdAt">) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveBudget: (input: Omit<Budget, "id" | "createdAt">, existingId?: string) => Promise<void>;
  setSetting: (key: Setting["key"], value: string) => Promise<void>;
  exportData: () => ExportPayload;
  importData: (payload: ExportPayload) => Promise<void>;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  transactions: [], categories: [], budgets: [], settings: [], ready: false,
  async hydrate() {
    if (get().ready) return;
    let categories = await db.categories.toArray();
    if (!categories.length) { await db.categories.bulkAdd(starterCategories); categories = starterCategories; }
    const [transactions, budgets, settings] = await Promise.all([db.transactions.toArray(), db.budgets.toArray(), db.settings.toArray()]);
    set({ transactions, categories, budgets, settings, ready: true });
  },
  async addTransaction(input) { const now = new Date().toISOString(); const item = { ...input, id: uid("txn"), createdAt: now, updatedAt: now }; await db.transactions.add(item); set((state) => ({ transactions: [item, ...state.transactions] })); },
  async updateTransaction(id, input) { const item = { ...input, updatedAt: new Date().toISOString() }; await db.transactions.update(id, item); set((state) => ({ transactions: state.transactions.map((transaction) => transaction.id === id ? { ...transaction, ...item } : transaction) })); },
  async deleteTransaction(id) { await db.transactions.delete(id); set((state) => ({ transactions: state.transactions.filter((transaction) => transaction.id !== id) })); },
  async addCategory(input) { const item = { ...input, id: uid("cat"), createdAt: new Date().toISOString() }; await db.categories.add(item); set((state) => ({ categories: [...state.categories, item] })); },
  async deleteCategory(id) { await db.categories.delete(id); set((state) => ({ categories: state.categories.filter((category) => category.id !== id) })); },
  async saveBudget(input, existingId) { const item = { ...input, id: existingId ?? uid("budget"), createdAt: new Date().toISOString() }; await db.budgets.put(item); set((state) => ({ budgets: existingId ? state.budgets.map((budget) => budget.id === existingId ? item : budget) : [...state.budgets, item] })); },
  async setSetting(key, value) { const item = { key, value }; await db.settings.put(item); set((state) => ({ settings: [...state.settings.filter((setting) => setting.key !== key), item] })); },
  exportData() { const { transactions, categories, budgets, settings } = get(); return { version: 1, exportedAt: new Date().toISOString(), transactions, categories, budgets, settings }; },
  async importData(payload) { await db.transaction("rw", db.transactions, db.categories, db.budgets, db.settings, async () => { await Promise.all([db.transactions.clear(), db.categories.clear(), db.budgets.clear(), db.settings.clear()]); await Promise.all([db.transactions.bulkAdd(payload.transactions), db.categories.bulkAdd(payload.categories), db.budgets.bulkAdd(payload.budgets), db.settings.bulkAdd(payload.settings)]); }); set({ transactions: payload.transactions, categories: payload.categories, budgets: payload.budgets, settings: payload.settings, ready: true }); },
}));

export type { TransactionType };
