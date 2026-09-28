import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  LogOut,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/accounts", label: "Accounts", icon: Wallet },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    queryClient.clear();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <header className="md:hidden flex items-center justify-between bg-ink-900 text-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Zap className="text-emerald-500" size={20} />
          <span className="font-display font-semibold text-base tracking-tight">
            FinPulse
          </span>
        </div>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="p-1.5 rounded-md hover:bg-ink-800"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <aside
        className={`${
          menuOpen ? "flex" : "hidden"
        } md:flex w-full md:w-64 bg-ink-900 text-slate-100 flex-col shrink-0`}
      >
        <div className="hidden md:flex items-center gap-2 px-6 py-6">
          <Zap className="text-emerald-500" size={22} />
          <span className="font-display font-semibold text-lg tracking-tight">
            FinPulse
          </span>
        </div>

        <nav className="flex-1 px-3 py-2 md:py-0 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ink-700 text-white"
                    : "text-slate-400 hover:bg-ink-800 hover:text-slate-100"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-6">
          <div className="flex items-center gap-3 px-3 py-3 mb-2 border-t border-ink-700 pt-4">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-semibold text-white shrink-0">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <p className="text-sm font-medium text-slate-100 truncate">
              {user?.name}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-400 hover:bg-ink-800 hover:text-slate-100 transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
