import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { api } from "../api";

export default function FinancialHealthPage() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await api.getHealth();
      setHealth(res);
    } catch (err) {
      console.error("Error fetching financial health:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !health) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Auditing 6 financial health pillars...</p>
      </div>
    );
  }

  const { overall_score, overall_rating, overall_summary, indicators } = health;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Transparent Financial Health Engine</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          No black-box scores. Every indicator discloses its evaluated metric, risk reason, and actionable adjustment.
        </p>
      </div>

      {/* Overall Score Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-white dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 rounded-2xl bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-500/30 flex flex-col items-center justify-center shadow-md dark:shadow-indigo-500/10">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{overall_score}</span>
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400">OUT OF 100</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">{overall_rating} Financial Health</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl mt-1 leading-relaxed">
              {overall_summary}
            </p>
          </div>
        </div>

        <Link
          to="/simulator"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition whitespace-nowrap self-stretch sm:self-auto justify-center"
        >
          <span>Optimize in Simulator</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 6 Transparent Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {indicators.map((ind, idx) => {
          const isGood = ind.status === "Good";
          const isWarning = ind.status === "Needs Attention";
          const isDanger = ind.status === "High Risk";

          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border ${
                isDanger
                  ? "border-rose-300 dark:border-rose-500/40"
                  : isWarning
                  ? "border-amber-300 dark:border-amber-500/30"
                  : "border-slate-200 dark:border-slate-800"
              } shadow-sm dark:shadow-xl flex flex-col justify-between space-y-4 transition-colors`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{ind.badge}</span>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">{ind.name}</h2>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      isGood
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20"
                        : isWarning
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border-amber-300 dark:border-amber-500/20"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400 border-rose-300 dark:border-rose-500/20"
                    }`}
                  >
                    {ind.status}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">{ind.value}</span>
                  <span className="text-xs text-slate-500 font-semibold">({ind.score}/100 Pillar Score)</span>
                </div>

                {/* Transparent Reason Section */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Why did the system evaluate this?
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{ind.reason}</p>
                </div>
              </div>

              {/* Possible Action Section */}
              <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 flex items-start gap-2.5">
                <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-indigo-800 dark:text-indigo-300 block mb-0.5">Recommended Action:</span>
                  <span className="text-slate-700 dark:text-slate-300">{ind.possible_action}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
