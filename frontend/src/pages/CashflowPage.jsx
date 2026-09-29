import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign, Wallet, Percent, ShieldCheck, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { api } from "../api";
import { useTheme } from "../context/ThemeContext";

export default function CashflowPage() {
  const navigate = useNavigate();
  const [cashflow, setCashflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    fetchCashflow();
  }, []);

  const fetchCashflow = async () => {
    try {
      setLoading(true);
      const res = await api.getCashflow();
      setCashflow(res);
    } catch (err) {
      console.error("Error fetching cashflow:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !cashflow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Computing Cash Flow Engine metrics...</p>
      </div>
    );
  }

  const {
    monthly_income,
    monthly_expenses,
    monthly_investments,
    monthly_emi,
    monthly_surplus,
    surplus_rate,
    history,
    expense_categories,
    status
  } = cashflow;

  const gridStroke = isDark ? "#334155" : "#E2E8F0";
  const textStroke = isDark ? "#94A3B8" : "#64748B";
  const tooltipBg = isDark ? "#0F172A" : "#FFFFFF";
  const tooltipBorder = isDark ? "#334155" : "#E2E8F0";
  const tooltipColor = isDark ? "#F8FAFC" : "#0F172A";

  const handleAskContextual = (query) => {
    navigate("/ai-cfo", { state: { prefilled: query } });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Cash Flow Engine</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Algorithmic reconciliation of monthly post-tax income, living expenses, debt obligations, investment contributions, and free surplus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            ✓ 20.8% Surplus Rate
          </span>
        </div>
      </div>

      {/* Prominent Section 8: AI CFO INSIGHT */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/60 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-600/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                ✦ AI CFO INSIGHT
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              "Your cash flow is currently positive. ₹25,000 is being invested monthly while ₹25,000 remains available as free surplus."
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAskContextual("Why did my surplus change?")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white whitespace-nowrap shadow-sm transition"
        >
          <span>Ask AI CFO About My Cash Flow</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Section 8: Monthly Cash Flow Formula Banner with Professional Terminology */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Monthly Cash Flow Formula</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
            {status}
          </span>
        </div>

        {/* Visual equation with exact requested terminology */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center text-center">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">INCOME</div>
            <div className="text-base font-black text-emerald-600 dark:text-emerald-400">+₹{monthly_income.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Post-tax salary</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">LIVING EXPENSES</div>
            <div className="text-base font-black text-rose-600 dark:text-rose-400">-₹{monthly_expenses.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Housing, food & lifestyle</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">DEBT OBLIGATIONS</div>
            <div className="text-base font-black text-amber-600 dark:text-amber-400">-₹{monthly_emi.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Auto loan EMI (10% DTI)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">INVESTMENT CONTRIBUTIONS</div>
            <div className="text-base font-black text-indigo-600 dark:text-indigo-400">-₹{monthly_investments.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Monthly automated SIP</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-600/15 dark:border-indigo-500/30">
            <div className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold mb-1">= FREE SURPLUS</div>
            <div className="text-base font-black text-slate-900 dark:text-white">₹{monthly_surplus.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">20.8% Surplus Rate</div>
          </div>
        </div>
      </div>

      {/* Historical Cash Flow Trend (Bar) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">6-Month Historical Cash Flow & Surplus</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly breakdown of inflows vs outflows and net free cash</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.6} />
              <XAxis dataKey="month" stroke={textStroke} fontSize={11} />
              <YAxis
                stroke={textStroke}
                fontSize={11}
                tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipColor, borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                formatter={(val, name) => [`₹${Number(val).toLocaleString("en-IN")}`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="income" name="Inflow (Salary)" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Living Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="investments" name="Investment SIP" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emi" name="Debt Obligations" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="surplus" name="Monthly Surplus" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Surplus Rate Analysis & Expense Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Surplus Rate & Capacity Analysis</h2>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-black text-xl">
              20.8%
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">20.8% Free Surplus Rate</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                You retain ₹{monthly_surplus.toLocaleString("en-IN")} uncommitted buffer out of ₹{monthly_income.toLocaleString("en-IN")} post-tax income after funding ₹{monthly_investments.toLocaleString("en-IN")} in SIPs and ₹{monthly_emi.toLocaleString("en-IN")} in loan servicing.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">Total Monthly Inflow</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">₹{monthly_income.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">Living Expenses</span>
              <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">-₹{monthly_expenses.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">Debt Obligations (EMI)</span>
              <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">-₹{monthly_emi.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">Investment Contributions</span>
              <span className="font-bold text-purple-600 dark:text-purple-400 font-mono">-₹{monthly_investments.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1.5 bg-slate-50 dark:bg-slate-950 px-2 rounded">
              <span className="font-bold text-slate-900 dark:text-white">Free Monthly Surplus</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono">+₹{monthly_surplus.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3 transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Expense Distribution</h2>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">Total: ₹58,000</span>
          </div>

          <div className="space-y-3">
            {expense_categories.map((c, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{c.category}</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">₹{c.amount.toLocaleString("en-IN")} ({c.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.percentage}%`, backgroundColor: c.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 19: Contextual AI CFO Questions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-slate-900 dark:text-white">Contextual Cash Flow Questions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAskContextual("Why did my surplus change?")}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 dark:bg-slate-800 dark:hover:bg-indigo-950/40 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
          >
            "Why did my surplus change?"
          </button>
          <button
            onClick={() => handleAskContextual("Where can I reduce expenses?")}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 dark:bg-slate-800 dark:hover:bg-indigo-950/40 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
          >
            "Where can I reduce expenses?"
          </button>
        </div>
      </div>
    </div>
  );
}
