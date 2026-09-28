import { useQuery } from "@tanstack/react-query";
import { fetchTransactions, fetchTransactionsByAccount } from "../api/mockApi";

export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
    staleTime: 60 * 1000,
  });
}

export function useTransactionsByAccount(accountId: string | undefined) {
  return useQuery({
    queryKey: ["transactions", "account", accountId],
    queryFn: () => fetchTransactionsByAccount(accountId as string),
    enabled: Boolean(accountId),
  });
}
