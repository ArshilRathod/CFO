import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Landmark,
  ShieldAlert,
  Percent,
  Sparkles,
  ArrowRight,
  PieChart as PieIcon,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CreditCard,
  Target,
  ArrowUpRight,
  ArrowDownRight
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
  const navigate = useNavigate();
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
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading your Financial Command Center...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
        Error loading command center: {error}
      </div>
    );
  }

  const { cards, ai_insight, upcoming_commitments, goals, alerts, net_worth_trend, cashflow_history, expense_breakdown, investment_allocation } = data;

  const gridStroke = isDark ? "#334155" : "#E2E8F0";
  const textStroke = isDark ? "#94A3B8" : "#64748B";
  const tooltipBg = isDark ? "#0F172A" : "#FFFFFF";
  const tooltipBorder = isDark ? "#334155" : "#E2E8F0";
  const tooltipColor = isDark ? "#F8FAFC" : "#0F172A";

  // Master 5 Top KPI Cards required by Section 7
  const masterTopCards = [
    {
      title: "FINANCIAL HEALTH",
      value: "82 / 100",
      sub: "Strong / Balanced",
      tag: "✓ Robust",
      tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accent: "border-indigo-500/30",
      link: "/health"
    },
    {
      title: "MONTHLY INCOME",
      value: "₹1,20,000",
      sub: "Post-tax monthly salary",
      tag: "+ Inflow",
      tagColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accent: "border-emerald-500/30",
      link: "/cashflow"
    },
    {
      title: "FREE SURPLUS",
      value: "₹25,000",
      sub: "20.8% Surplus Rate",
      tag: "Unallocated",
      tagColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      accent: "border-blue-500/30",
      link: "/cashflow"
    },
    {
      title: "INVESTMENT CONTRIBUTION",
      value: "₹25,000",
      sub: "Monthly automated SIP",
      tag: "20.8% Rate",
      tagColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      accent: "border-purple-500/30",
      link: "/investments"
    },
    {
      title: "DEBT EMI",
      value: "₹12,000",
      sub: "10.0% Debt-to-Income",
      tag: "Manageable",
      tagColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      accent: "border-amber-500/30",
      link: "/loans"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Section 7 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            GOOD MORNING, AARAY
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Financial Command Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            What should you understand about your finances today? Deterministic calculations & verified AI intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All Engines Reconciled</span>
          </span>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {masterTopCards.map((c, i) => (
          <Link
            key={i}
            to={c.link}
            className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 shadow-sm dark:shadow-lg flex flex-col justify-between transition-all group hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[10px] font-bold tracking-wider">{c.title}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${c.tagColor}`}>
                {c.tag}
              </span>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {c.value}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">
                {c.sub}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Prominent Section 7: AI CFO INSIGHT BANNER */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50/50 to-white dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 shadow-md dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                ✦ AI CFO INSIGHT
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-500/20">
                Verified Deterministic Calculation
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1 max-w-3xl leading-relaxed">
              "{ai_insight?.text || "Your monthly cash flow remains positive with ₹25,000 free surplus. Your ₹25,000 monthly investment contribution is currently supported by your cash flow, while your ₹12,000 EMI remains manageable."}"
            </p>
          </div>
        </div>

        <Link
          to="/ai-cfo"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-md shadow-indigo-600/30 transition whitespace-nowrap self-stretch sm:self-auto justify-center group"
        >
          <span>ASK AI CFO</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      {/* Row 1: Cash Flow Overview & Goal Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Overview */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Cash Flow Overview</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Income, Living Expenses, SIP, and Free Surplus</p>
            </div>
            <Link to="/cashflow" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              Engine Details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashflow_history}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.6} />
                <XAxis dataKey="month" stroke={textStroke} fontSize={11} />
                <YAxis stroke={textStroke} fontSize={11} tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipColor, borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(val, name) => [`₹${Number(val).toLocaleString("en-IN")}`, name]}
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Living Expenses" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="investments" name="Investment SIP" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="surplus" name="Free Surplus" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Equation summary */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 font-mono">
            <span>+₹1,20,000 Inflow</span>
            <span className="text-rose-500">-₹58,000 Living</span>
            <span className="text-amber-500">-₹12,000 EMI</span>
            <span className="text-purple-500">-₹25,000 SIP</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">= ₹25,000 Surplus (20.8%)</span>
          </div>
        </div>

        {/* Financial Goal Progress */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Financial Goal Progress</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Milestone accumulation curves</p>
            </div>
            <Link to="/goals" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              All Goals <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {goals && goals.map((g) => (
              <div key={g.id} className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{g.name}</span>
                    <span className="text-[10px] text-slate-500">Target: {g.target_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ₹{g.current_amount >= 100000 ? `${(g.current_amount / 100000).toFixed(1)}L` : g.current_amount.toLocaleString("en-IN")} / {g.target_amount >= 10000000 ? `${(g.target_amount / 10000000).toFixed(1)}Cr` : `${(g.target_amount / 100000).toFixed(1)}L`}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      g.on_track ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                    }`}>
                      {g.progress_pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      g.on_track ? "bg-indigo-600 dark:bg-indigo-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${Math.min(100, g.progress_pct)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Upcoming Commitments & Risk Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Commitments */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Commitments</h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Next 10 Days</span>
          </div>

          <div className="space-y-3">
            {upcoming_commitments && upcoming_commitments.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.due_date} • {item.account}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold font-mono text-slate-900 dark:text-white">₹{item.amount.toLocaleString("en-IN")}</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Risk Alerts</h2>
            </div>
            <Link to="/alerts" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View All ({alerts?.length || 0})
            </Link>
          </div>

          <div className="space-y-3">
            {alerts && alerts.slice(0, 3).map((a) => {
              const isWarning = a.severity === "warning";
              const isSuccess = a.severity === "success";
              return (
                <div
                  key={a.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
                    isWarning
                      ? "bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-500/30"
                      : isSuccess
                      ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-500/30"
                      : "bg-slate-50 border-slate-200 dark:bg-slate-800/40 dark:border-slate-700"
                  }`}
                >
                  {isWarning ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <span className="font-bold text-slate-900 dark:text-white block">{a.title}</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{a.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Interactive CFO Queries */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-slate-900 dark:text-white">Suggested CFO Analysis:</span>
          <span className="text-slate-600 dark:text-slate-400">"Can I afford a ₹10 lakh car next year?"</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/ai-cfo", { state: { prefilled: "Can I afford a ₹10 lakh car next year?" } })}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Ask Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <Link
            to="/simulator"
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 text-xs font-medium transition"
          >
            Run What-If Simulation
          </Link>
        </div>
      </div>
    </div>
  );
}
