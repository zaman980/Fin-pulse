import type { Account, Transaction } from "../types";

export const mockAccounts: Account[] = [
  {
    id: "acc-1",
    name: "Everyday Current Account",
    type: "checking",
    balance: 12000000,
    currency: "PKR",
    accountNumber: "**** 4821",
  },
  {
    id: "acc-2",
    name: "Savings Plus",
    type: "savings",
    balance: 121000000,
    currency: "PKR",
    accountNumber: "**** 7742",
  },
  {
    id: "acc-3",
    name: "Rewards Credit Card",
    type: "credit",
    balance: -1280000,
    currency: "PKR",
    accountNumber: "**** 9013",
  },
];

function rs(rupees: number): number {
  return rupees * 100;
}

function daysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

interface SampleTransaction {
  accountId: string;
  daysAgo: number;
  description: string;
  category: Transaction["category"];
  amount: number;
}

const sampleTransactions: SampleTransaction[] = [
  { accountId: "acc-3", daysAgo: 0, description: "Foodpanda Order", category: "dining", amount: -rs(1850) },
  { accountId: "acc-1", daysAgo: 1, description: "Imtiaz Super Market", category: "groceries", amount: -rs(7420) },
  { accountId: "acc-3", daysAgo: 3, description: "Daraz", category: "shopping", amount: -rs(12600) },
  { accountId: "acc-1", daysAgo: 5, description: "Salary Credit", category: "salary", amount: rs(185000) },
  { accountId: "acc-1", daysAgo: 7, description: "LESCO Electricity", category: "utilities", amount: -rs(14200) },
  { accountId: "acc-3", daysAgo: 9, description: "Netflix Subscription", category: "entertainment", amount: -rs(1500) },
  { accountId: "acc-1", daysAgo: 12, description: "Butt Karahi", category: "dining", amount: -rs(4300) },
  { accountId: "acc-2", daysAgo: 15, description: "Transfer to Savings", category: "transfer", amount: rs(40000) },
  { accountId: "acc-1", daysAgo: 18, description: "SNGPL Gas Bill", category: "utilities", amount: -rs(5800) },
  { accountId: "acc-3", daysAgo: 22, description: "Khaadi", category: "shopping", amount: -rs(9800) },
  { accountId: "acc-1", daysAgo: 26, description: "House Rent", category: "rent", amount: -rs(60000) },
  { accountId: "acc-1", daysAgo: 33, description: "Salary Credit", category: "salary", amount: rs(185000) },
  { accountId: "acc-1", daysAgo: 36, description: "Carrefour", category: "groceries", amount: -rs(11250) },
  { accountId: "acc-3", daysAgo: 41, description: "Cinepax", category: "entertainment", amount: -rs(3200) },
  { accountId: "acc-1", daysAgo: 47, description: "PTCL Internet", category: "utilities", amount: -rs(4500) },
  { accountId: "acc-1", daysAgo: 55, description: "House Rent", category: "rent", amount: -rs(60000) },
  { accountId: "acc-3", daysAgo: 62, description: "Sapphire", category: "shopping", amount: -rs(15400) },
  { accountId: "acc-1", daysAgo: 66, description: "Salary Credit", category: "salary", amount: rs(185000) },
  { accountId: "acc-1", daysAgo: 74, description: "Al-Fatah Store", category: "groceries", amount: -rs(8900) },
  { accountId: "acc-3", daysAgo: 84, description: "Cafe Aylanto", category: "dining", amount: -rs(6100) },
];

export const mockTransactions: Transaction[] = sampleTransactions.map(
  (t, index) => ({
    id: `txn-${index + 1}`,
    accountId: t.accountId,
    date: daysAgo(t.daysAgo),
    description: t.description,
    category: t.category,
    amount: t.amount,
    status: t.daysAgo < 2 ? "pending" : "completed",
  })
);
