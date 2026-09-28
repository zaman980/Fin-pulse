import { memo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "../types";
import { formatCurrency, formatDate } from "../utils/format";

const categoryLabels: Record<Transaction["category"], string> = {
  groceries: "Groceries",
  utilities: "Utilities",
  salary: "Salary",
  transfer: "Transfer",
  entertainment: "Entertainment",
  dining: "Dining",
  shopping: "Shopping",
  rent: "Rent",
};

interface TransactionRowProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

function TransactionRow({ transaction, onEdit, onDelete }: TransactionRowProps) {
  const isCredit = transaction.amount > 0;
  const hasActions = Boolean(onEdit && onDelete);

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-3 pl-6 pr-4 text-sm text-slate-600">
        {formatDate(transaction.date)}
      </td>
      <td className="py-3 pr-4 text-sm font-medium text-ink-900">
        {transaction.description}
      </td>
      <td className="py-3 pr-4">
        <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600">
          {categoryLabels[transaction.category]}
        </span>
      </td>
      <td className="py-3 pr-4">
        {transaction.status === "pending" ? (
          <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-amber-500/10 text-amber-500">
            Pending
          </span>
        ) : (
          <span className="inline-block text-xs font-medium px-2 py-1 rounded bg-emerald-500/10 text-emerald-600">
            Completed
          </span>
        )}
      </td>
      <td
        className={`py-3 pr-6 text-right text-sm font-semibold ${
          isCredit ? "text-emerald-600" : "text-ink-900"
        }`}
      >
        {formatCurrency(transaction.amount)}
      </td>
      {hasActions && (
        <td className="py-3 pr-6">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => onEdit?.(transaction)}
              aria-label={`Edit ${transaction.description}`}
              className="p-1.5 rounded-md text-slate-400 hover:text-ink-900 hover:bg-slate-100"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onDelete?.(transaction)}
              aria-label={`Delete ${transaction.description}`}
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-600/5"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}

export default memo(TransactionRow);
