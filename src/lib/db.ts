import Dexie, { type Table } from "dexie";
import type { Budget, Category, Setting, Transaction } from "./types";

export class BudgetDatabase extends Dexie {
  transactions!: Table<Transaction, string>;
  categories!: Table<Category, string>;
  budgets!: Table<Budget, string>;
  settings!: Table<Setting, string>;

  constructor() {
    super("pocket-ledger");
    this.version(1).stores({
      transactions: "id, type, categoryId, date, updatedAt",
      categories: "id, type",
      budgets: "id, categoryId, month",
      settings: "key",
    });
  }
}

export const db = new BudgetDatabase();
