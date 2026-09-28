import { useCallback, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useAccounts } from "../hooks/useAccounts";
import { useTransactions } from "../hooks/useTransactions";
import {
  useCreateTransaction,
  useDeleteTransaction,
  useUpdateTransaction,
} from "../hooks/useTransactionMutations";
import TransactionRow from "../components/TransactionRow";
import TransactionForm from "../components/TransactionForm";
import ErrorMessage from "../components/ErrorMessage";
import { transactionCategories } from "../data/categories";
import type { Transaction, TransactionInput } from "../types";

type CategoryFilter = Transaction["category"] | "all";

export default function Transactions() {
  const {
    data: transactions,
    isLoading,
    isError,
    refetch,
  } = useTransactions();
  const { data: accounts } = useAccounts();

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const { reset: resetCreate } = createMutation;
  const { reset: resetUpdate } = updateMutation;
  const { mutate: deleteTransaction, isError: deleteFailed } =
    useDeleteTransaction();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | undefined>(undefined);

  const filtered = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      const matchesSearch = t.description
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = category === "all" || t.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, search, category]);

  const handleAdd = () => {
    resetCreate();
    resetUpdate();
    setEditing(undefined);
    setFormOpen(true);
  };

  const handleEdit = useCallback(
    (transaction: Transaction) => {
      resetCreate();
      resetUpdate();
      setEditing(transaction);
      setFormOpen(true);
    },
    [resetCreate, resetUpdate]
  );

  const handleDelete = useCallback(
    (transaction: Transaction) => {
      if (window.confirm(`Delete "${transaction.description}"?`)) {
        deleteTransaction(transaction.id);
      }
    },
    [deleteTransaction]
  );

  const handleClose = useCallback(() => {
    setFormOpen(false);
    setEditing(undefined);
  }, []);

  function handleSubmit(input: TransactionInput) {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input },
        { onSuccess: handleClose }
      );
    } else {
      createMutation.mutate(input, { onSuccess: handleClose });
    }
  }

  const activeMutation = editing ? updateMutation : createMutation;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">Transactions</h1>
          <p className="text-sm text-slate-600 mt-1">
            {filtered.length} transaction{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <button
          onClick={handleAdd}
          disabled={!accounts}
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-md transition-colors shrink-0"
        >
          <Plus size={16} />
          Add transaction
        </button>
      </div>

      {deleteFailed && (
        <div className="mb-4">
          <ErrorMessage message="We couldn't delete that transaction. Please try again." />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            aria-label="Search transactions"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
          />
        </div>
        <select
          aria-label="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryFilter)}
          className="border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
        >
          <option value="all">All categories</option>
          {transactionCategories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {isLoading ? (
          <p className="text-sm text-slate-400 p-6">Loading transactions…</p>
        ) : isError ? (
          <div className="p-4">
            <ErrorMessage
              message="We couldn't load your transactions."
              onRetry={() => refetch()}
            />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-400 p-6">
            No transactions match your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="py-3 pl-6 pr-4 text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="py-3 pr-4 text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Description
                  </th>
                  <th className="py-3 pr-4 text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Category
                  </th>
                  <th className="py-3 pr-4 text-xs font-medium text-slate-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="py-3 pr-4 text-xs font-medium text-slate-400 uppercase tracking-wide text-right">
                    Amount
                  </th>
                  <th className="py-3 pr-6 text-xs font-medium text-slate-400 uppercase tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <TransactionRow
                    key={t.id}
                    transaction={t}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {formOpen && accounts && (
        <TransactionForm
          transaction={editing}
          accounts={accounts}
          isSaving={activeMutation.isPending}
          error={activeMutation.error ? activeMutation.error.message : null}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
