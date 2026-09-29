import React, { useState } from "react";
import { RefreshCw, Bell, Shield, Key, Check, AlertTriangle } from "lucide-react";
import { api } from "../api";

export default function SettingsPage() {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [notifications, setNotifications] = useState({
    spending_spike: true,
    emergency_shortfall: true,
    goal_deviation: true,
    weekly_digest: false,
  });

  const handleResetDemo = async () => {
    if (!confirm("Are you sure? This will wipe all edits and reset your account to default 6-month demo data.")) return;
    try {
      setResetting(true);
      await api.resetDemo();
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        window.location.reload();
      }, 1500);
    } catch (err) {
      alert("Failed to reset: " + err.message);
    } finally {
      setResetting(false);
    }
  };

  const toggleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage system preferences, privacy parameters, and demo state reset
        </p>
      </div>

      {/* Demo Reset Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Demo Data Management</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Restore the pristine benchmark test dataset for demo presentations. This resets all transactions, portfolio valuations, Axis auto loan parameters, and House goal calculations back to the original baseline.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? "animate-spin" : ""}`} />
            <span>{resetting ? "Resetting Demo State..." : "Reset Demo Account"}</span>
          </button>

          {resetSuccess && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-4 h-4" /> Reset completed! Reloading...
            </span>
          )}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Bell className="w-4 h-4 text-amber-500" />
          <span>Automated Risk Alert Triggers</span>
        </div>

        <div className="space-y-3 text-xs">
          {[
            { key: "spending_spike", title: "Discretionary Spending Anomaly", desc: "Notify when any category jumps &gt;25% over 6-month average" },
            { key: "emergency_shortfall", title: "Emergency Reserve Alert", desc: "Trigger warning if runway falls below 6 months" },
            { key: "goal_deviation", title: "Milestone Gap Notice", desc: "Alert when required SIP exceeds current allocation by &gt;₹5,000" },
            { key: "weekly_digest", title: "Weekly Financial Health Digest", desc: "Summary of weekly surplus and net worth progression" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80">
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</div>
              </div>
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={() => toggleNotif(item.key)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Prototype Scope */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3 transition-colors">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Security & Prototype Scope</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          AI CFO is an interactive Smart India Hackathon engineering prototype. It does not integrate real Open Banking APIs or live broker credentials. All financial calculations occur on your local Python FastAPI server with zero external data transmission.
        </p>
      </div>
    </div>
  );
}
