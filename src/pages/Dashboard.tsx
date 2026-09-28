import { useMemo } from "react";
import { Wallet, PiggyBank, CreditCard, TrendingDown } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import { useAccounts } from "../hooks/useAccounts";
import { useTransactions } from "../hooks/useTransactions";
import StatCard from "../components/StatCard";
import ErrorMessage from "../components/ErrorMessage";
import { formatCurrency, formatDate } from "../utils/format";

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name.trim().split(" ")[0];
  const {
    data: accounts,
    isLoading: accountsLoading,
    isError: accountsError,
    refetch: refetchAccounts,
  } = useAccounts();
  const {
    data: transactions,
    isLoading: txLoading,
    isError: txError,
    refetch: refetchTransactions,
  } = useTransactions();

  const checking = accounts?.find((a) => a.type === "checking");
  const savings = accounts?.find((a) => a.type === "savings");
  const credit = accounts?.find((a) => a.type === "credit");

  const spendByMonth = useMemo(() => {
    if (!transactions) return [];

    const months: Record<string, number> = {};
    for (const t of transactions) {
      if (t.amount >= 0) continue;
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      months[key] = (months[key] || 0) + Math.abs(t.amount);
    }

    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, total]) => ({
        month: new Date(`${key}-01T00:00:00`).toLocaleDateString("en-GB", {
          month: "short",
        }),
        total: total / 100,
      }));
  }, [transactions]);

  const totalSpend = useMemo(() => {
    if (!transactions) return 0;
    return transactions
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactions]);

  const recentTransactions = transactions?.slice(0, 6) ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink-900">Overview</h1>
        <p className="text-sm text-slate-600 mt-1">
          Welcome back, {firstName}. Here's what's happening across your accounts.
        </p>
      </div>

      {(accountsError || txError) && (
        <div className="mb-6">
          <ErrorMessage
            onRetry={() => {
              if (accountsError) refetchAccounts();
              if (txError) refetchTransactions();
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Checking"
          value={
            accountsLoading || !checking
              ? "—"
              : formatCurrency(checking.balance)
          }
          hint={checking?.accountNumber}
          icon={Wallet}
        />
        <StatCard
          label="Savings"
          value={
            accountsLoading || !savings ? "—" : formatCurrency(savings.balance)
          }
          hint={savings?.accountNumber}
          icon={PiggyBank}
          tone="positive"
        />
        <StatCard
          label="Credit Card"
          value={
            accountsLoading || !credit ? "—" : formatCurrency(credit.balance)
          }
          hint={credit?.accountNumber}
          icon={CreditCard}
          tone="negative"
        />
        <StatCard
          label="Spend (90 days)"
          value={txLoading ? "—" : formatCurrency(-totalSpend)}
          hint="Across all accounts"
          icon={TrendingDown}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-ink-900 mb-4">
            Spending trend
          </h2>
          {txLoading ? (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
              Loading chart…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={spendByMonth}>
                <defs>
                  <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14795A" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#14795A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEF1F4" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "#8B96A3" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  width={88}
                  tick={{ fontSize: 12, fill: "#8B96A3" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `Rs ${Number(v).toLocaleString("en-PK")}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `Rs ${Number(value).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`,
                    "Spend",
                  ]}
                  contentStyle={{ fontSize: 13, borderRadius: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#14795A"
                  strokeWidth={2}
                  fill="url(#spend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-ink-900 mb-4">
            Recent activity
          </h2>
          {txLoading ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : (
            <ul className="space-y-4">
              {recentTransactions.map((t) => (
                <li key={t.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-900">
                      {t.description}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(t.date)}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      t.amount > 0 ? "text-emerald-600" : "text-ink-900"
                    }`}
                  >
                    {formatCurrency(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
