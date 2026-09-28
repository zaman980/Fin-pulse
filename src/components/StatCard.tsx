import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "positive" | "negative";
}

const toneStyles = {
  default: "text-ink-900",
  positive: "text-emerald-600",
  negative: "text-rose-600",
};

export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <Icon size={18} className="text-slate-400" />
      </div>
      <p className={`font-display text-2xl font-semibold ${toneStyles[tone]}`}>
        {value}
      </p>
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
