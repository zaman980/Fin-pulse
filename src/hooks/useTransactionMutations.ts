import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../api/mockApi";
import type { TransactionInput } from "../types";

function useRefreshData() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
      queryClient.invalidateQueries({ queryKey: ["accounts"] }),
    ]);
}

export function useCreateTransaction() {
  const refreshData = useRefreshData();
  return useMutation({
    mutationFn: (input: TransactionInput) => createTransaction(input),
    onSuccess: refreshData,
  });
}

export function useUpdateTransaction() {
  const refreshData = useRefreshData();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TransactionInput }) =>
      updateTransaction(id, input),
    onSuccess: refreshData,
  });
}

export function useDeleteTransaction() {
  const refreshData = useRefreshData();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: refreshData,
  });
}
