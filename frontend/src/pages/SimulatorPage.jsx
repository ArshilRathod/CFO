import React, { useState, useEffect } from "react";
import { Sliders, Sparkles, Check, ArrowRight, Save, RotateCcw, AlertTriangle, ShieldCheck } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { api } from "../api";
import { useTheme } from "../context/ThemeContext";

export default function SimulatorPage() {
  const [params, setParams] = useState({
    income_change_pct: 0,
    expense_change_pct: 0,
    additional_sip: 0,
    purchase_price: 0,
    down_payment: 0,
    loan_tenure_years: 5,
    interest_rate: 9.5,
    job_loss_months: 0,
    scenario_preset: null,
  });

  const [simResult, setSimResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveName, setSaveName] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    runSim(params);
  }, []);

  const runSim = async (currentParams) => {
    try {
      setLoading(true);
      const res = await api.runSimulation(currentParams);
      setSimResult(res);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (presetKey) => {
    let newParams = {
      income_change_pct: 0,
      expense_change_pct: 0,
      additional_sip: 0,
      purchase_price: 0,
      down_payment: 0,
      loan_tenure_years: 5,
      interest_rate: 9.5,
      job_loss_months: 0,
      scenario_preset: presetKey,
    };

    if (presetKey === "salary_plus_20") {
      newParams.income_change_pct = 20;
    } else if (presetKey === "expenses_plus_10") {
      newParams.expense_change_pct = 10;
    } else if (presetKey === "sip_plus_5000") {
      newParams.additional_sip = 5000;
    } else if (presetKey === "car_15l") {
      newParams.purchase_price = 1500000;
      newParams.down_payment = 300000;
      newParams.loan_tenure_years = 5;
    } else if (presetKey === "job_loss_6m") {
      newParams.job_loss_months = 6;
      newParams.income_change_pct = -100;
    }

    setParams(newParams);
    runSim(newParams);
  };

  const handleParamChange = (field, val) => {
    const updated = { ...params, [field]: parseFloat(val) || 0, scenario_preset: "custom" };
    setParams(updated);
    runSim(updated);
  };

  const handleReset = () => {
    const base = {
      income_change_pct: 0,
      expense_change_pct: 0,
      additional_sip: 0,
      purchase_price: 0,
      down_payment: 0,
      loan_tenure_years: 5,
      interest_rate: 9.5,
      job_loss_months: 0,
      scenario_preset: null,
    };
    setParams(base);
    runSim(base);
  };

  const handleSaveScenario = async (e) => {
    e.preventDefault();
    if (!saveName.trim()) return;
    try {
      await api.saveScenario(saveName, params);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      setSaveName("");
    } catch (err) {
      alert("Failed to save: " + err.message);
    }
  };

  const gridStroke = isDark ? "#334155" : "#E2E8F0";
  const textStroke = isDark ? "#94A3B8" : "#64748B";
  const tooltipBg = isDark ? "#0F172A" : "#FFFFFF";
  const tooltipBorder = isDark ? "#334155" : "#E2E8F0";
  const tooltipColor = isDark ? "#F8FAFC" : "#0F172A";

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">What-If Simulator</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          "What happens if...?" — Test major life decisions, pay raises, asset purchases, and emergencies before committing capital
        </p>
      </div>

      {/* 5 Preset Buttons */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Predefined Real-World Scenarios
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { id: "salary_plus_20", label: "Salary +20%", desc: "Promotion / Raise" },
            { id: "expenses_plus_10", label: "Expenses +10%", desc: "Inflationary jump" },
            { id: "sip_plus_5000", label: "SIP +₹5,000", desc: "Step up investment" },
            { id: "car_15l", label: "Buy ₹15L Car", desc: "₹3L down + 5yr EMI" },
            { id: "job_loss_6m", label: "Job Loss (6 mo)", desc: "Emergency stress test" },
          ].map((preset) => {
            const active = params.scenario_preset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className={`p-3 rounded-xl text-left border transition ${
                  active
                    ? "bg-indigo-50 border-indigo-500 text-indigo-900 ring-1 ring-indigo-500/40 dark:bg-indigo-600/30 dark:border-indigo-500 dark:text-white"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="font-bold text-xs">{preset.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{preset.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Controls & Inputs */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Interactive Scenario Levers</h2>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Current Baseline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Salary / Income Delta: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{params.income_change_pct}%</span>
            </label>
            <input
              type="range"
              min="-100"
              max="100"
              step="5"
              value={params.income_change_pct}
              onChange={(e) => handleParamChange("income_change_pct", e.target.value)}
              className="w-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Expense Delta: <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">{params.expense_change_pct}%</span>
            </label>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={params.expense_change_pct}
              onChange={(e) => handleParamChange("expense_change_pct", e.target.value)}
              className="w-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Additional Monthly SIP: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">₹{params.additional_sip.toLocaleString("en-IN")}</span>
            </label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={params.additional_sip}
              onChange={(e) => handleParamChange("additional_sip", e.target.value)}
              className="w-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Job Loss Duration: <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">{params.job_loss_months} Months</span>
            </label>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={params.job_loss_months}
              onChange={(e) => handleParamChange("job_loss_months", e.target.value)}
              className="w-full accent-indigo-600 dark:accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Capital Purchase section */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Asset Purchase Price (₹)</label>
            <input
              type="number"
              placeholder="e.g. 1500000 (₹15 Lakhs)"
              value={params.purchase_price || ""}
              onChange={(e) => handleParamChange("purchase_price", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Down Payment (₹)</label>
            <input
              type="number"
              placeholder="e.g. 300000"
              value={params.down_payment || ""}
              onChange={(e) => handleParamChange("down_payment", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Loan Tenure (Years)</label>
            <select
              value={params.loan_tenure_years}
              onChange={(e) => handleParamChange("loan_tenure_years", e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              <option value="3">3 Years (36 Months)</option>
              <option value="5">5 Years (60 Months)</option>
              <option value="7">7 Years (84 Months)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Comparison: CURRENT vs SCENARIO */}
      {simResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CURRENT BASELINE CARD */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  CURRENT SITUATION
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Baseline
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Monthly In-Hand Income</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">₹{simResult.baseline.monthly_income.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Monthly Expenses</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">₹{simResult.baseline.monthly_expenses.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Monthly Total EMI</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">₹{simResult.baseline.monthly_emi.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Monthly Investments / SIP</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">₹{simResult.baseline.monthly_investments.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950/60 px-2 rounded">
                  <span className="text-slate-700 dark:text-slate-300 font-bold">Free Monthly Surplus</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono">₹{simResult.baseline.monthly_surplus.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400">Emergency Fund Buffer</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{simResult.baseline.emergency_fund_months} months</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400">Debt-to-Income (DTI)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{simResult.baseline.dti_ratio}%</span>
                </div>
              </div>
            </div>

            {/* SCENARIO CARD */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/40 shadow-sm dark:shadow-xl space-y-3 transition-colors">
              <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-950/60 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                  SCENARIO OUTCOME
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                  Modeled Impact
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-indigo-100 dark:border-indigo-950/40">
                  <span className="text-slate-600 dark:text-slate-400">Simulated Income</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">₹{simResult.scenario.monthly_income.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-indigo-100 dark:border-indigo-950/40">
                  <span className="text-slate-600 dark:text-slate-400">Simulated Expenses</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">₹{simResult.scenario.monthly_expenses.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-indigo-100 dark:border-indigo-950/40">
                  <span className="text-slate-600 dark:text-slate-400">New Total EMI (incl. new loans)</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">₹{simResult.scenario.monthly_emi.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-indigo-100 dark:border-indigo-950/40">
                  <span className="text-slate-600 dark:text-slate-400">Simulated Monthly SIP</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">₹{simResult.scenario.monthly_investments.toLocaleString("en-IN")}</span>
                </div>
                <div className={`flex justify-between py-1.5 border-b border-indigo-100 dark:border-indigo-950/40 px-2 rounded ${
                  simResult.scenario.monthly_surplus >= 0 ? "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400"
                }`}>
                  <span className="font-bold">Simulated Monthly Surplus</span>
                  <span className="font-black font-mono">
                    ₹{simResult.scenario.monthly_surplus.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-indigo-100 dark:border-indigo-950/40">
                  <span className="text-slate-600 dark:text-slate-400">Remaining Emergency Buffer</span>
                  <span className={`font-bold ${
                    simResult.scenario.emergency_fund_months < 3 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"
                  }`}>
                    {simResult.scenario.emergency_fund_months} months
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400">New Debt Burden (DTI)</span>
                  <span className={`font-bold ${
                    simResult.scenario.dti_ratio > 35 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {simResult.scenario.dti_ratio}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Assessment & Recommendation */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 flex items-start gap-3 shadow-sm transition-colors">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">AI CFO System Verdict:</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{simResult.recommendation}</p>
            </div>
          </div>

          {/* 5-Year Net Worth Projection Chart */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">5-Year Net Worth Wealth Trajectory</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Comparison: Sticking to current plan vs Executing this scenario</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simResult.projection_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.6} />
                  <XAxis dataKey="year" stroke={textStroke} fontSize={11} />
                  <YAxis
                    stroke={textStroke}
                    fontSize={11}
                    tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipColor, borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(val, name) => [`₹${Number(val).toLocaleString("en-IN")}`, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="Current Projection" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="Scenario Projection" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[11px] text-slate-500 text-center italic">
              {simResult.disclaimer}
            </div>
          </div>

          {/* Save Scenario Bar */}
          <form onSubmit={handleSaveScenario} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Scenario Name (e.g. Dream Car 2026)"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 outline-none w-full sm:w-64"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white whitespace-nowrap transition shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Scenario</span>
              </button>
            </div>
            {savedSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Scenario saved to database!
              </span>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
