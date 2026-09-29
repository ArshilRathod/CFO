import React, { useState, useEffect } from "react";
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, Check, Trash2, ShieldAlert } from "lucide-react";
import { api } from "../api";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const filteredAlerts = alerts.filter((a) => {
    if (filter === "unread") return !a.is_read;
    if (filter === "warning") return a.severity === "warning" || a.severity === "danger";
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Risk & Anomaly Alerts</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time notifications triggered by our rule engines monitoring spending spikes, emergency shortages, and debt levels
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs shadow-xs transition-colors">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded transition ${
              filter === "all" ? "bg-indigo-600 text-white font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-3 py-1 rounded transition ${
              filter === "unread" ? "bg-indigo-600 text-white font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Unread ({alerts.filter((a) => !a.is_read).length})
          </button>
          <button
            onClick={() => setFilter("warning")}
            className={`px-3 py-1 rounded transition ${
              filter === "warning" ? "bg-indigo-600 text-white font-semibold" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Warnings
          </button>
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
                className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                  !alert.is_read
                    ? isWarning
                      ? "bg-white border-amber-300 dark:bg-slate-900 dark:border-amber-500/40 shadow-sm"
                      : "bg-white border-indigo-200 dark:bg-slate-900 dark:border-indigo-500/40 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 opacity-80"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isWarning
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20"
                        : isSuccess
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{alert.title}</span>
                      {!alert.is_read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{alert.message}</p>
                    <div className="flex items-center gap-3 pt-1 text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                      <span className="uppercase tracking-wider">{alert.category}</span>
                      <span>•</span>
                      <span>System Rule Generated</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!alert.is_read && (
                    <button
                      onClick={() => handleMarkRead(alert.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
                      title="Mark as Read"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mark Read</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition"
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
