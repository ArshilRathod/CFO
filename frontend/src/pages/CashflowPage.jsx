import React, { useState, useEffect } from "react";
import { TrendingUp, ArrowDownRight, ArrowUpRight, DollarSign, Wallet, Percent, ShieldCheck } from "lucide-react";
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
        <p className="text-xs text-slate-500 dark:text-slate-400">Computing cash flow engine metrics...</p>
      </div>
    );
  }

  const {
    monthly_income,
    monthly_expenses,
    monthly_investments,
    monthly_emi,
    monthly_surplus,
    savings_rate,
    history,
    expense_categories,
    status
  } = cashflow;

  const gridStroke = isDark ? "#334155" : "#E2E8F0";
  const textStroke = isDark ? "#94A3B8" : "#64748B";
  const tooltipBg = isDark ? "#0F172A" : "#FFFFFF";
  const tooltipBorder = isDark ? "#334155" : "#E2E8F0";
  const tooltipColor = isDark ? "#F8FAFC" : "#0F172A";

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Cash Flow Engine</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Algorithmic breakdown of monthly inflows, fixed liabilities, automated SIPs and free cash surplus
        </p>
      </div>

      {/* Cash Flow Equation Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/50 to-white dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Monthly Cash Flow Formula</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
            {status}
          </span>
        </div>

        {/* Visual equation */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center text-center">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">INCOME</div>
            <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">+₹{monthly_income.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Post-tax salary</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">EXPENSES</div>
            <div className="text-base font-extrabold text-rose-600 dark:text-rose-400">-₹{monthly_expenses.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Living & essentials</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">LOAN EMI</div>
            <div className="text-base font-extrabold text-amber-600 dark:text-amber-400">-₹{monthly_emi.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Auto loan servicing</div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mb-1">INVESTMENTS</div>
            <div className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">-₹{monthly_investments.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Automated SIPs</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-600/15 dark:border-indigo-500/30">
            <div className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold mb-1">= FREE SURPLUS</div>
            <div className="text-base font-black text-slate-900 dark:text-white">₹{monthly_surplus.toLocaleString("en-IN")}</div>
            <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">{savings_rate}% Savings Rate</div>
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
              <Bar dataKey="investments" name="Investments / SIP" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emi" name="Loan EMI" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="surplus" name="Monthly Surplus" fill="#38BDF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings Rate & Expenditure Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Savings Rate Analysis</h2>
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-black text-xl">
              {savings_rate}%
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">High Wealth Accumulator Tier</div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                You save/invest ₹{(monthly_investments + monthly_surplus).toLocaleString("en-IN")} out of ₹{monthly_income.toLocaleString("en-IN")} monthly earnings. Standard benchmark is 20%.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">Total Inflow</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{monthly_income.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">Total Outflow (Spend + EMI + SIP)</span>
              <span className="font-bold text-slate-900 dark:text-white">₹{(monthly_expenses + monthly_emi + monthly_investments).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">Unallocated Buffer</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">+₹{monthly_surplus.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3 transition-colors">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Expense Distribution</h2>
          <div className="space-y-3">
            {expense_categories.map((c, i) => (
              <div key={i} className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{c.category}</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{c.amount.toLocaleString("en-IN")} ({c.percentage}%)</span>
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
    </div>
  );
}
