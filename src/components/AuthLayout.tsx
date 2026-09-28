import type { ReactNode } from "react";
import { Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Zap className="text-emerald-500" size={26} />
          <span className="font-display font-semibold text-2xl text-white tracking-tight">
            FinPulse
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
