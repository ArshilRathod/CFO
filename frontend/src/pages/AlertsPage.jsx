import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Check,
  Trash2,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Target,
  DollarSign
} from "lucide-react";
import { api } from "../api";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.getAlerts();
      setAlerts(res);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markAlertRead(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_read: true } : a))
      );
    } catch (err) {
      alert("Failed to mark read: " + err.message);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.dismissAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert("Failed to dismiss alert: " + err.message);
    }
  };

  const handleAskAiAboutAlert = (alertItem) => {
    let question = "";
    if (alertItem.category === "cashflow" || alertItem.title.toLowerCase().includes("spending")) {
      question = "Why did my discretionary spending increase this month and where can I optimize?";
    } else if (alertItem.category === "goal" || alertItem.title.toLowerCase().includes("goal")) {
      question = "How does my current ₹15,000 SIP impact my ₹40L house downpayment goal timeline?";
    } else if (alertItem.category === "debt" || alertItem.title.toLowerCase().includes("emi")) {
      question = "Can I afford another loan given my existing ₹12,000 monthly EMI and ₹25,000 surplus?";
    } else if (alertItem.category === "investment") {
      question = "What happens if I increase my monthly SIP by ₹5,000 given my ₹25,000 current surplus?";
    } else {
      question = `How should I handle this alert: "${alertItem.title}"?`;
    }
    navigate("/ai-cfo", { state: { prefilled: question } });
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "unread") return !a.is_read;
    if (filter === "warning") return a.severity === "warning" || a.severity === "danger";
    if (filter === "cashflow") return a.category === "cashflow" || a.category === "spending";
    if (filter === "goal") return a.category === "goal";
    if (filter === "debt") return a.category === "debt";
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Insights & Alerts
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
              Deterministic Rules + AI Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grounded in Aaray Sharma's verified ledger (₹1.20L Income • ₹58k Living Expenses • ₹12k EMI • ₹25k SIP • ₹25k Surplus)
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-xs transition-colors">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg transition font-medium ${
              filter === "all"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded-lg transition font-medium ${
              filter === "unread"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Unread ({alerts.filter((a) => !a.is_read).length})
          </button>
          <button
            onClick={() => setFilter("warning")}
            className={`px-3 py-1 rounded-lg transition font-medium ${
              filter === "warning"
                ? "bg-amber-600 text-white font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Warnings
          </button>
          <button
            onClick={() => setFilter("cashflow")}
            className={`px-3 py-1 rounded-lg transition font-medium ${
              filter === "cashflow"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Cash Flow
          </button>
          <button
            onClick={() => setFilter("goal")}
            className={`px-3 py-1 rounded-lg transition font-medium ${
              filter === "goal"
                ? "bg-indigo-600 text-white font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Goals
          </button>
        </div>
      </div>

      {/* Traceability Context Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-blue-900/10 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <ShieldAlert className="w-4 h-4" />
              <span>DETERMINISTIC DATA INTEGRITY VERIFICATION</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Every insight is produced by deterministic rule evaluators tracking cash flow, goal milestones, and debt ratios. The AI CFO layer reasons over these verified calculations.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center flex-shrink-0">
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Monthly Inflow</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white font-mono">₹1,20,000</div>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Fixed Commitments</div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">₹37,000</div>
            </div>
            <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Free Surplus</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">₹25,000 (20.8%)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-xs text-slate-500">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            Loading alert triggers...
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs shadow-sm">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            No active alerts under this filter. All financial rules are within normal thresholds.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isWarning = alert.severity === "warning";
            const isDanger = alert.severity === "danger";
            const isSuccess = alert.severity === "success";

            const Icon = isDanger
              ? AlertCircle
              : isWarning
              ? AlertTriangle
              : isSuccess
              ? CheckCircle2
              : Info;

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  !alert.is_read
                    ? isWarning
                      ? "bg-white border-amber-300 dark:bg-slate-900 dark:border-amber-500/40 shadow-sm"
                      : isSuccess
                      ? "bg-white border-emerald-300 dark:bg-slate-900 dark:border-emerald-500/40 shadow-sm"
                      : "bg-white border-indigo-200 dark:bg-slate-900 dark:border-indigo-500/40 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 opacity-80"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isWarning
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                        : isSuccess
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {alert.title}
                      </span>
                      {!alert.is_read && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                          NEW
                        </span>
                      )}
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {alert.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {alert.message}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="font-mono">Ground Truth: Aaray Sharma Demo Ledger</span>
                      <span>•</span>
                      <span>Status: {alert.is_read ? "Acknowledged" : "Requires Attention"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleAskAiAboutAlert(alert)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:hover:bg-indigo-500/25 dark:text-indigo-300 text-xs font-semibold transition border border-indigo-200 dark:border-indigo-500/30"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask AI CFO</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {!alert.is_read && (
                    <button
                      onClick={() => handleMarkRead(alert.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                      title="Mark as Read"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mark Read</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition"
                    title="Dismiss Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
