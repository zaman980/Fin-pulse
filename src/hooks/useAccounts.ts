import { useQuery } from "@tanstack/react-query";
import { fetchAccountById, fetchAccounts } from "../api/mockApi";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });
}

export function useAccount(id: string | undefined) {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => fetchAccountById(id as string),
    enabled: Boolean(id),
  });
}
