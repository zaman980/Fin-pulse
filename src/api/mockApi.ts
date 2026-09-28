import { mockAccounts, mockTransactions } from "../data/mockData";
import type { Account, Transaction, TransactionInput } from "../types";

const STORAGE_KEY = "finpulse-transactions";

function loadTransactions(): Transaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Transaction[];
    }
  } catch {
    return [...mockTransactions];
  }
  return [...mockTransactions];
}

let transactions: Transaction[] = loadTransactions();

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    return;
  }
}

function sortByDateDesc(list: Transaction[]): Transaction[] {
  return [...list].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function delay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

function withCurrentBalance(account: Account): Account {
  const total = transactions
    .filter((t) => t.accountId === account.id)
    .reduce((sum, t) => sum + t.amount, 0);
  return { ...account, balance: account.balance + total };
}

export async function fetchAccounts(): Promise<Account[]> {
  return delay(mockAccounts.map(withCurrentBalance), 400);
}

export async function fetchAccountById(id: string): Promise<Account | undefined> {
  const account = mockAccounts.find((a) => a.id === id);
  return delay(account ? withCurrentBalance(account) : undefined, 300);
}

export async function fetchTransactions(): Promise<Transaction[]> {
  return delay(sortByDateDesc(transactions), 600);
}

export async function fetchTransactionsByAccount(
  accountId: string
): Promise<Transaction[]> {
  return delay(
    sortByDateDesc(transactions.filter((t) => t.accountId === accountId)),
    400
  );
}

export async function createTransaction(
  input: TransactionInput
): Promise<Transaction> {
  const created: Transaction = { ...input, id: `txn-${Date.now()}` };
  transactions = [created, ...transactions];
  saveTransactions();
  return delay(created, 500);
}

export async function updateTransaction(
  id: string,
  input: TransactionInput
): Promise<Transaction> {
  const existing = transactions.find((t) => t.id === id);
  if (!existing) {
    throw new Error("This transaction no longer exists.");
  }
  const updated: Transaction = { ...input, id };
  transactions = transactions.map((t) => (t.id === id ? updated : t));
  saveTransactions();
  return delay(updated, 500);
}

export async function deleteTransaction(id: string): Promise<void> {
  transactions = transactions.filter((t) => t.id !== id);
  saveTransactions();
  return delay(undefined, 400);
}
