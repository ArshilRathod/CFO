import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  PieChart,
  Landmark,
  Target,
  Activity,
  Sliders,
  Bot,
  Bell,
  User,
  Settings,
  UserPlus,
  Sparkles
} from "lucide-react";

const navItems = [
  { section: "CORE OVERVIEW" },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: Receipt },
  { name: "Cash Flow", path: "/cashflow", icon: TrendingUp },

  { section: "PORTFOLIO & DEBT" },
  { name: "Investments", path: "/investments", icon: PieChart },
  { name: "Loans & Debt", path: "/loans", icon: Landmark },
  { name: "Financial Goals", path: "/goals", icon: Target },

  { section: "INTELLIGENCE & AI" },
  {
    name: "AI CFO Chat",
    path: "/ai-cfo",
    icon: Bot,
    highlight: true,
    badge: "AI Layer"
  },
  { name: "Financial Health", path: "/health", icon: Activity },
  { name: "What-If Simulator", path: "/simulator", icon: Sliders },
  { name: "Risk Alerts", path: "/alerts", icon: Bell },

  { section: "CONFIGURATION" },
  { name: "Profile", path: "/profile", icon: User },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "Onboarding Form", path: "/onboarding", icon: UserPlus },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto transition-colors duration-200">
      <div className="p-4 space-y-1">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div
                key={idx}
                className="pt-4 pb-1 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase"
              >
                {item.section}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? item.highlight
                      ? "bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm dark:bg-gradient-to-r dark:from-indigo-600/30 dark:to-purple-600/30 dark:text-indigo-300 dark:border-indigo-500/40 dark:shadow-indigo-500/10"
                      : "bg-slate-100 text-slate-900 border border-slate-300/80 shadow-sm dark:bg-slate-800 dark:text-white dark:border-slate-700/60"
                    : item.highlight
                    ? "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/50"
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    item.highlight ? "text-indigo-600 dark:text-indigo-400" : ""
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 font-bold border border-indigo-500/20">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800/80">
        <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200/80 dark:bg-gradient-to-br dark:from-indigo-950/60 dark:to-purple-950/40 dark:border-indigo-500/20">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot Active</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Powered by deterministic backend calculation engines & rules.
          </p>
        </div>
      </div>
    </aside>
  );
}
