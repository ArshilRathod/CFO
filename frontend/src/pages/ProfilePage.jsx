import React, { useState, useEffect } from "react";
import { User, Mail, ShieldCheck, Database, Target, Compass, Edit2, Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getProfile();
      setProfile(res);
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Financial Identity & Profile</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Stored financial attributes, baseline assumptions, and regulatory prototype consent
          </p>
        </div>
        <Link
          to="/onboarding"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Re-run Onboarding</span>
        </Link>
      </div>

      {/* User Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-indigo-500/25 flex-shrink-0">
          AS
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Aarav Sharma</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
              Demo Profile Active
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">demo@aicfo.finance • {profile.employment}</p>
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-600 dark:text-slate-300">
            <div>Age: <span className="font-bold text-slate-900 dark:text-white">{profile.age} years</span></div>
            <div>Dependents: <span className="font-bold text-slate-900 dark:text-white">{profile.dependents}</span></div>
            <div>Risk Category: <span className="font-bold text-indigo-600 dark:text-indigo-400">{profile.risk_preference}</span></div>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Baselines */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3 transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Financial Baselines</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Monthly In-Hand Income</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">₹{profile.monthly_income.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Baseline Living Expenses</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">₹{profile.monthly_expenses.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Liquid Savings (Emergency Buffer)</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">₹{profile.savings.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
              <span className="text-slate-500 dark:text-slate-400">Total Existing Investments</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">₹{profile.total_investments.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500 dark:text-slate-400">Emergency Target</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{profile.emergency_fund_target_months} Months</span>
            </div>
          </div>
        </div>

        {/* Data Sources & Consent */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Data Sources & Consent</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400 font-bold">
                <span>Active Data Pipeline:</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Simulated Ledger</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                6-Month transactional bank feed + Zerodha broking portfolio + Axis Bank loan account.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Prototype Consent:
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">GRANTED</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                Consent given for automated calculation engines and AI CFO orchestration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
