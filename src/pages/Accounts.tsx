import { Link } from "react-router-dom";
import { Wallet, PiggyBank, CreditCard, ChevronRight } from "lucide-react";
import { useAccounts } from "../hooks/useAccounts";
import ErrorMessage from "../components/ErrorMessage";
import { formatCurrency } from "../utils/format";
import type { AccountType } from "../types";

const typeIcons: Record<AccountType, typeof Wallet> = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
};

const typeLabels: Record<AccountType, string> = {
  checking: "Current account",
  savings: "Savings account",
  credit: "Credit card",
};

export default function Accounts() {
  const { data: accounts, isLoading, isError, refetch } = useAccounts();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink-900">Accounts</h1>
        <p className="text-sm text-slate-600 mt-1">
          All accounts linked to your profile.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading accounts…</p>
      ) : isError ? (
        <ErrorMessage
          message="We couldn't load your accounts."
          onRetry={() => refetch()}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accounts?.map((account) => {
            const Icon = typeIcons[account.type];
            return (
              <Link
                key={account.id}
                to={`/accounts/${account.id}`}
                className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-ink-900 flex items-center justify-center">
                    <Icon size={18} className="text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {account.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {typeLabels[account.type]} · {account.accountNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-display text-base font-semibold ${
                      account.balance < 0 ? "text-rose-600" : "text-ink-900"
                    }`}
                  >
                    {formatCurrency(account.balance)}
                  </span>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
