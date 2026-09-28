export type AccountType = "checking" | "savings" | "credit";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  accountNumber: string;
}

export type TransactionCategory =
  | "groceries"
  | "utilities"
  | "salary"
  | "transfer"
  | "entertainment"
  | "dining"
  | "shopping"
  | "rent";

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  category: TransactionCategory;
  amount: number;
  status: "completed" | "pending";
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export type TransactionInput = Omit<Transaction, "id">;
