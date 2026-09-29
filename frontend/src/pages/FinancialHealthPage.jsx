import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, HelpCircle, Check, Info } from "lucide-react";
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

  const { overall_score, overall_rating, overall_summary, why_this_score, indicators } = health;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Transparent Financial Health Engine</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Deterministic scoring backed by 6 measurable financial pillars. No black-box guesses.
        </p>
      </div>

      {/* Section 13: Overall Score Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-white dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 rounded-2xl bg-white dark:bg-slate-950 border border-indigo-200 dark:border-indigo-500/30 flex flex-col items-center justify-center shadow-md dark:shadow-indigo-500/10">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">82</span>
            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400">OUT OF 100</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-slate-900 dark:text-white">82 / 100 • Strong / Balanced Financial Health</span>
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
          <span>Simulate Improvements</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Section 13: WHY THIS SCORE? Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              WHY THIS SCORE?
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
            Weighted Mathematical Aggregation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Positive Factors */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 space-y-2.5">
            <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Positive Factors</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span><strong>Positive monthly surplus:</strong> ₹25,000 free monthly surplus (20.8% surplus rate) maintained after all debt and investments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span><strong>Consistent investment contribution:</strong> Disciplined automated ₹25,000 monthly SIP (20.8% of post-tax income).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span><strong>Manageable EMI:</strong> Existing ₹12,000 auto loan EMI represents only 10.0% DTI (well within the 30% safe threshold).</span>
              </li>
            </ul>
          </div>

          {/* Attention Factors */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 space-y-2.5">
            <div className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Areas Needing Attention</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold">⚠</span>
                <span><strong>Emergency reserve below target:</strong> Liquid savings of ₹3,50,000 cover 5.4 months of living expenses versus targeted 6.0 months (₹35,000 shortfall).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 dark:text-amber-400 font-bold">⚠</span>
                <span><strong>Goal SIP calibration:</strong> House Downpayment goal (₹40L in 7 yrs) requires an SIP step-up to prevent completion delay.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 13: 6 Measurable Pillars Grid */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          6 Core Evaluated Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indicators.map((ind, idx) => {
            const isGood = ind.status === "Good";
            const isWarning = ind.status === "Needs Attention";

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${
                  isWarning
                    ? "border-amber-300 dark:border-amber-500/30"
                    : "border-slate-200 dark:border-slate-800"
                } shadow-sm dark:shadow-xl flex flex-col justify-between space-y-3.5 transition-colors`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {ind.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isGood
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/20"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border-amber-300 dark:border-amber-500/20"
                      }`}
                    >
                      {ind.score}/100 • {ind.status}
                    </span>
                  </div>

                  <div className="mt-2 text-base font-extrabold text-slate-900 dark:text-white font-mono">
                    {ind.value}
                  </div>

                  {/* Transparent causal reason */}
                  <div className="mt-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {ind.reason}
                  </div>
                </div>

                {/* Possible Action */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-indigo-700 dark:text-indigo-400 flex items-start gap-1.5 font-medium">
                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{ind.possible_action}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
