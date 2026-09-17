export type TransactionType = "income" | "expense";
export type CategoryType = "income" | "expense" | "both";
export type CurrencyCode = "TND" | "USD" | "EUR";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  note: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string;
  createdAt: string;
}

export type SettingKey = "theme" | "biometricEnabled" | "currency";
export interface Setting {
  key: SettingKey;
  value: string;
}

export interface ExportPayload {
  version: 1;
  exportedAt: string;
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  settings: Setting[];
}
