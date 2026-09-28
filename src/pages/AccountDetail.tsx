import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAccount } from "../hooks/useAccounts";
import { useTransactionsByAccount } from "../hooks/useTransactions";
import TransactionRow from "../components/TransactionRow";
import ErrorMessage from "../components/ErrorMessage";
import { formatCurrency } from "../utils/format";

export default function AccountDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    data: account,
    isLoading: accountLoading,
    isError: accountError,
    refetch: refetchAccount,
  } = useAccount(id);
  const {
    data: transactions,
    isLoading: txLoading,
    isError: txError,
    refetch: refetchTransactions,
  } = useTransactionsByAccount(id);

  if (accountError) {
    return (
      <div>
        <ErrorMessage
          message="We couldn't load this account."
          onRetry={() => refetchAccount()}
        />
        <Link to="/accounts" className="text-sm text-emerald-600 mt-4 inline-block">
          Back to accounts
        </Link>
      </div>
    );
  }

  if (!accountLoading && !account) {
    return (
      <div>
        <p className="text-sm text-slate-600">Account not found.</p>
        <Link to="/accounts" className="text-sm text-emerald-600 mt-2 inline-block">
          Back to accounts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/accounts"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-ink-900 mb-6"
      >
        <ArrowLeft size={15} />
        Back to accounts
      </Link>

      {accountLoading || !account ? (
        <p className="text-sm text-slate-400">Loading account…</p>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-sm text-slate-400">{account.accountNumber}</p>
            <h1 className="text-xl font-semibold text-ink-900">
              {account.name}
            </h1>
            <p
              className={`font-display text-3xl font-semibold mt-3 ${
                account.balance < 0 ? "text-rose-600" : "text-ink-900"
              }`}
            >
              {formatCurrency(account.balance)}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-ink-900">
                Transaction history
              </h2>
            </div>
            {txLoading ? (
              <p className="text-sm text-slate-400 p-6">Loading…</p>
            ) : txError ? (
              <div className="p-4">
                <ErrorMessage
                  message="We couldn't load the transaction history."
                  onRetry={() => refetchTransactions()}
                />
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <tbody>
                    {transactions.map((t) => (
                      <TransactionRow key={t.id} transaction={t} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-400 p-6">
                No transactions on this account yet.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
