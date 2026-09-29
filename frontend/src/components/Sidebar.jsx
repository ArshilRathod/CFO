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
  Sparkles,
  Bell,
  User,
  Settings
} from "lucide-react";

const navSections = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Financial Command Center", path: "/dashboard", icon: LayoutDashboard }
    ]
  },
  {
    title: "MY MONEY",
    items: [
      { name: "Transactions", path: "/transactions", icon: Receipt },
      { name: "Cash Flow", path: "/cashflow", icon: TrendingUp },
      { name: "Investments", path: "/investments", icon: PieChart },
      { name: "Debt & Loans", path: "/loans", icon: Landmark }
    ]
  },
  {
    title: "MY PLAN",
    items: [
      { name: "Financial Goals", path: "/goals", icon: Target },
      { name: "Financial Health", path: "/health", icon: Activity }
    ]
  },
  {
    title: "AI CFO",
    items: [
      {
        name: "Ask AI CFO",
        path: "/ai-cfo",
        icon: Sparkles,
        highlight: true,
        badge: "Hero Intelligence"
      },
      { name: "What-If Analysis", path: "/simulator", icon: Sliders },
      { name: "Insights & Alerts", path: "/alerts", icon: Bell }
    ]
  },
  {
    title: "ACCOUNT",
    items: [
      { name: "Profile", path: "/profile", icon: User },
      { name: "Settings", path: "/settings", icon: Settings }
    ]
  }
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto transition-colors duration-200">
      <div className="p-3.5 space-y-4">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {section.title}
            </div>

            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? item.highlight
                          ? "bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm dark:bg-gradient-to-r dark:from-indigo-600/30 dark:to-purple-600/30 dark:text-indigo-300 dark:border-indigo-500/40 dark:shadow-indigo-500/10"
                          : "bg-slate-100 text-slate-900 border border-slate-300/80 shadow-sm dark:bg-slate-800 dark:text-white dark:border-slate-700/60"
                        : item.highlight
                        ? "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-500/10 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-500/20"
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
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-bold border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
}
