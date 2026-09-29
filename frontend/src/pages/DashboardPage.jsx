import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Landmark,
  ShieldAlert,
  Percent,
  Sparkles,
  ArrowRight,
  PieChart as PieIcon,
  ChevronRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { api } from "../api";
import { useTheme } from "../context/ThemeContext";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading your financial intelligence cockpit...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
        Error loading dashboard: {error}
      </div>
    );
  }

  const { cards, net_worth_trend, cashflow_history, expense_breakdown, investment_allocation } = data;

  const gridStroke = isDark ? "#334155" : "#E2E8F0";
  const textStroke = isDark ? "#94A3B8" : "#64748B";
  const tooltipBg = isDark ? "#0F172A" : "#FFFFFF";
  const tooltipBorder = isDark ? "#334155" : "#E2E8F0";
  const tooltipColor = isDark ? "#F8FAFC" : "#0F172A";

  const topMetricCards = [
    { title: "NET WORTH", value: cards.net_worth.formatted, sub: cards.net_worth.subtitle, trend: cards.net_worth.trend, positive: cards.net_worth.positive, icon: Wallet, lightBorder: "border-blue-200", lightBg: "from-blue-50/50 to-white", darkColor: "dark:from-blue-500/20 dark:to-indigo-500/10 dark:border-blue-500/30" },
    { title: "MONTHLY INCOME", value: cards.monthly_income.formatted, sub: cards.monthly_income.subtitle, trend: cards.monthly_income.trend, positive: true, icon: TrendingUp, lightBorder: "border-emerald-200", lightBg: "from-emerald-50/50 to-white", darkColor: "dark:from-emerald-500/20 dark:to-teal-500/10 dark:border-emerald-500/30" },
    { title: "MONTHLY EXPENSE", value: cards.monthly_expenses.formatted, sub: cards.monthly_expenses.subtitle, trend: cards.monthly_expenses.trend, positive: false, icon: ArrowDownRight, lightBorder: "border-pink-200", lightBg: "from-pink-50/50 to-white", darkColor: "dark:from-pink-500/20 dark:to-rose-500/10 dark:border-pink-500/30" },
    { title: "INVESTMENTS", value: cards.investments.formatted, sub: cards.investments.subtitle, trend: cards.investments.trend, positive: true, icon: PieIcon, lightBorder: "border-purple-200", lightBg: "from-purple-50/50 to-white", darkColor: "dark:from-purple-500/20 dark:to-indigo-500/10 dark:border-purple-500/30" },
    { title: "LOANS / DEBT", value: cards.loans.formatted, sub: cards.loans.subtitle, trend: cards.loans.trend, positive: true, icon: Landmark, lightBorder: "border-amber-200", lightBg: "from-amber-50/50 to-white", darkColor: "dark:from-amber-500/20 dark:to-orange-500/10 dark:border-amber-500/30" },
    { title: "SAVINGS RATE", value: cards.savings_rate.formatted, sub: cards.savings_rate.subtitle, trend: cards.savings_rate.trend, positive: true, icon: Percent, lightBorder: "border-cyan-200", lightBg: "from-cyan-50/50 to-white", darkColor: "dark:from-cyan-500/20 dark:to-blue-500/10 dark:border-cyan-500/30" },
    { title: "EMERGENCY FUND", value: cards.emergency_fund.formatted, sub: cards.emergency_fund.subtitle, trend: cards.emergency_fund.trend, positive: false, icon: ShieldAlert, lightBorder: "border-yellow-200", lightBg: "from-yellow-50/50 to-white", darkColor: "dark:from-yellow-500/20 dark:to-amber-500/10 dark:border-yellow-500/30" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with AI CFO callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50/60 to-white dark:from-indigo-950/80 dark:via-purple-950/50 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm dark:shadow-xl transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/15 dark:bg-indigo-600/30 border border-indigo-300 dark:border-indigo-500/40 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">AI CFO Intelligence Overview</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                Score {data.financial_health_score}/100 • {data.financial_health_rating}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Live calculated data: Free surplus is ₹25,000/mo. Primary optimization: close the 0.6 mo emergency buffer.
            </p>
          </div>
        </div>

        <Link
          to="/ai-cfo"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 transition whitespace-nowrap"
        >
          <span>Ask AI CFO</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 7 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {topMetricCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`p-4 rounded-xl bg-gradient-to-b ${card.lightBg} ${card.darkColor} bg-white dark:bg-slate-900 border ${card.lightBorder} shadow-sm dark:shadow-none flex flex-col justify-between transition-colors`}
            >
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                <span className="text-[10px] font-bold tracking-wider">{card.title}</span>
                <Icon className="w-3.5 h-3.5 opacity-70" />
              </div>
              <div>
                <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate">{card.sub}</div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{card.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 1 Charts: Net Worth Trend & Income vs Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Worth Trend */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Net Worth Trend (6 Months)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Assets minus Total Liabilities progression</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
              +14.2% Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={net_worth_trend}>
                <defs>
                  <linearGradient id="nwGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.6} />
                <XAxis dataKey="month" stroke={textStroke} fontSize={11} />
                <YAxis
                  stroke={textStroke}
                  fontSize={11}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipColor, borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Net Worth"]}
                />
                <Area type="monotone" dataKey="net_worth" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#nwGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income vs Expenses Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Income vs Expenses & Investments</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly cash distribution</p>
            </div>
            <Link to="/cashflow" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View Cash Flow <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflow_history}>
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
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="investments" name="Investments" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Expense Breakdown & Investment Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Expense Breakdown</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total: ₹58,000 (Current Month)</p>
            </div>
            <span className="text-xs text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/20 font-semibold">
              Shopping Spike +32%
            </span>
          </div>

          <div className="space-y-3">
            {expense_breakdown.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900 dark:text-white font-bold">₹{item.amount.toLocaleString("en-IN")}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Allocation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Investment Asset Allocation</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Portfolio Total: ₹14.2 Lakhs</p>
            </div>
            <Link to="/investments" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              Holdings <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investment_allocation}
                    dataKey="percentage"
                    nameKey="asset_class"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {investment_allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipColor, borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(val, name) => [`${val}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5">
              {investment_allocation.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.asset_class}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-900 dark:text-white font-bold">₹{item.value.toLocaleString("en-IN")}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 text-center">
            Demo market data • Static portfolio simulation
          </div>
        </div>
      </div>

      {/* Quick Interactive Shortcuts */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-slate-900 dark:text-white">Suggested CFO Analysis:</span>
          <span className="text-slate-500 dark:text-slate-400">"Can I afford a ₹15 lakh car next year?"</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/ai-cfo"
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Ask Now</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <Link
            to="/simulator"
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-transparent text-xs font-medium transition"
          >
            Run What-If Simulator
          </Link>
        </div>
      </div>
    </div>
  );
}
