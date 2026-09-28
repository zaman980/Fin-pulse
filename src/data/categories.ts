import type { TransactionCategory } from "../types";

export const transactionCategories: Array<{
  value: TransactionCategory;
  label: string;
}> = [
  { value: "groceries", label: "Groceries" },
  { value: "utilities", label: "Utilities" },
  { value: "salary", label: "Salary" },
  { value: "transfer", label: "Transfer" },
  { value: "entertainment", label: "Entertainment" },
  { value: "dining", label: "Dining" },
  { value: "shopping", label: "Shopping" },
  { value: "rent", label: "Rent" },
];
