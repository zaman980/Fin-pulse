import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import FormField from "./FormField";
import { transactionCategories } from "../data/categories";
import { dateInputToIso, toDateInputValue } from "../utils/format";
import type {
  Account,
  Transaction,
  TransactionCategory,
  TransactionInput,
} from "../types";

interface TransactionFormProps {
  transaction?: Transaction;
  accounts: Account[];
  isSaving: boolean;
  error: string | null;
  onSubmit: (input: TransactionInput) => void;
  onClose: () => void;
}

type Kind = "expense" | "income";

const selectClass =
  "w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500";

export default function TransactionForm({
  transaction,
  accounts,
  isSaving,
  error,
  onSubmit,
  onClose,
}: TransactionFormProps) {
  const isEditing = Boolean(transaction);

  const [description, setDescription] = useState(transaction?.description ?? "");
  const [amount, setAmount] = useState(
    transaction ? String(Math.abs(transaction.amount) / 100) : ""
  );
  const [kind, setKind] = useState<Kind>(
    transaction && transaction.amount > 0 ? "income" : "expense"
  );
  const [category, setCategory] = useState<TransactionCategory>(
    transaction?.category ?? "groceries"
  );
  const [accountId, setAccountId] = useState(
    transaction?.accountId ?? accounts[0]?.id ?? ""
  );
  const [date, setDate] = useState(
    toDateInputValue(transaction?.date ?? new Date().toISOString())
  );
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);

    const value = Number(amount);
    if (!description.trim()) {
      setFormError("Please enter a description.");
      return;
    }
    if (!Number.isFinite(value) || value <= 0) {
      setFormError("Please enter an amount greater than zero.");
      return;
    }
    if (!date) {
      setFormError("Please choose a date.");
      return;
    }

    const paisa = Math.round(value * 100);
    onSubmit({
      accountId,
      date: dateInputToIso(date),
      description: description.trim(),
      category,
      amount: kind === "expense" ? -paisa : paisa,
      status: transaction?.status ?? "completed",
    });
  }

  const shownError = formError ?? error;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-form-title"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg w-full max-w-md max-h-full overflow-y-auto p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            id="transaction-form-title"
            className="text-lg font-semibold text-ink-900"
          >
            {isEditing ? "Edit transaction" : "Add transaction"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-md text-slate-400 hover:text-ink-900"
          >
            <X size={20} />
          </button>
        </div>

        {shownError && (
          <p
            role="alert"
            className="mb-4 text-sm text-rose-600 bg-rose-600/5 border border-rose-600/20 rounded-md px-3 py-2"
          >
            {shownError}
          </p>
        )}

        <FormField
          id="tx-description"
          label="Description"
          type="text"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="tx-amount"
            label="Amount (Rs)"
            type="number"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="mb-4">
            <label
              htmlFor="tx-kind"
              className="block text-sm font-medium text-slate-600 mb-1.5"
            >
              Type
            </label>
            <select
              id="tx-kind"
              value={kind}
              onChange={(e) => setKind(e.target.value as Kind)}
              className={selectClass}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="tx-category"
            className="block text-sm font-medium text-slate-600 mb-1.5"
          >
            Category
          </label>
          <select
            id="tx-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            className={selectClass}
          >
            {transactionCategories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="tx-account"
            className="block text-sm font-medium text-slate-600 mb-1.5"
          >
            Account
          </label>
          <select
            id="tx-account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className={selectClass}
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.accountNumber})
              </option>
            ))}
          </select>
        </div>

        <FormField
          id="tx-date"
          label="Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {isSaving ? "Saving…" : isEditing ? "Save changes" : "Add transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}
