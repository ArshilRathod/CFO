import React, { useState, useEffect } from "react";
import { Sliders, Sparkles, Check, ArrowRight, Save, RotateCcw, AlertTriangle, ShieldCheck, HelpCircle } from "lucide-react";
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

  // Section 17: Exact Presets
  const presets = [
    { id: "sip_plus_5000", label: "What if I increase SIP by ₹5,000?", desc: "+₹5,000 monthly investment contribution" },
    { id: "income_minus_20", label: "What if my income falls by 20%?", desc: "-20% salary reduction / shock" },
    { id: "loan_10l", label: "What if I take a ₹10 lakh loan?", desc: "₹10L loan @ 9.5% for 5 years" },
    { id: "expense_minus_5000", label: "What if I reduce discretionary spending by ₹5,000?", desc: "Trim shopping & dining out" },
  ];

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

    if (presetKey === "sip_plus_5000") {
      newParams.additional_sip = 5000;
    } else if (presetKey === "income_minus_20") {
      newParams.income_change_pct = -20;
    } else if (presetKey === "loan_10l") {
      newParams.purchase_price = 1000000;
      newParams.down_payment = 0; // pure ₹10L loan
      newParams.loan_tenure_years = 5;
    } else if (presetKey === "expense_minus_5000") {
      // 5000 is approximately 8.6% of 58,000
      newParams.expense_change_pct = -8.62;
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
      alert("Failed to save scenario: " + err.message);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">What-If Analysis</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Simulate life decisions, financial shocks, and investment adjustments. Scenario data is isolated and does not alter actual financial records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20 uppercase tracking-wider">
            Deterministic Scenario Engine
          </span>
        </div>
      </div>

      {/* Section 17: Presets Grid */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Suggested Decision Scenarios
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((preset) => {
            const active = params.scenario_preset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset.id)}
                className={`p-3.5 rounded-2xl text-left border transition ${
                  active
                    ? "bg-indigo-50 border-indigo-500 text-indigo-900 ring-1 ring-indigo-500/40 dark:bg-indigo-600/30 dark:border-indigo-500 dark:text-white shadow-sm"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800/40 shadow-xs"
                }`}
              >
                <div className="font-bold text-xs leading-snug">{preset.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{preset.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 17: Side-by-Side Comparison: CURRENT vs SIMULATION */}
      {simResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Side-by-Side Core Metric Comparison
            </span>
            <span className="text-[10px] text-slate-500">Actual Account Data vs Simulated Model</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CURRENT (Actual Data) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    CURRENT
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase border border-slate-200 dark:border-slate-700">
                  ACTUAL DATA
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Monthly Surplus */}
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">1. Monthly Surplus</span>
                  <div className="text-right">
                    <span className="font-black text-slate-900 dark:text-white font-mono text-sm">
                      ₹{simResult.baseline.monthly_surplus.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">20.8% Surplus Rate</span>
                  </div>
                </div>

                {/* 2. Debt Burden */}
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">2. Debt Burden (DTI)</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      {simResult.baseline.dti_ratio}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">EMI: ₹{simResult.baseline.monthly_emi.toLocaleString("en-IN")}/mo</span>
                  </div>
                </div>

                {/* 3. Investment Contribution */}
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">3. Investment Contribution</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      ₹{simResult.baseline.monthly_investments.toLocaleString("en-IN")}/mo
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">Automated SIP</span>
                  </div>
                </div>

                {/* 4. Goal Timeline */}
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">4. Goal Timeline</span>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      On Track
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">7 yrs to House target</span>
                  </div>
                </div>

                {/* 5. Financial Health */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">5. Financial Health</span>
                  <div className="text-right">
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      82 / 100
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">Strong / Balanced</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SIMULATION (Simulated Data) */}
            <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/40 shadow-sm dark:shadow-xl space-y-4 transition-colors">
              <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-950/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
                    SIMULATION
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-300 uppercase border border-indigo-300 dark:border-indigo-500/40">
                  SIMULATION DATA
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {/* 1. Monthly Surplus */}
                <div className="flex items-center justify-between py-1.5 border-b border-indigo-100 dark:border-indigo-950/40">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">1. Monthly Surplus</span>
                  <div className="text-right">
                    <span className={`font-black font-mono text-sm ${
                      simResult.scenario.monthly_surplus >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    }`}>
                      ₹{simResult.scenario.monthly_surplus.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-medium">
                      {simResult.impact.surplus_change >= 0 ? `+₹${simResult.impact.surplus_change.toLocaleString("en-IN")}` : `-₹${Math.abs(simResult.impact.surplus_change).toLocaleString("en-IN")}`} variance
                    </span>
                  </div>
                </div>

                {/* 2. Debt Burden */}
                <div className="flex items-center justify-between py-1.5 border-b border-indigo-100 dark:border-indigo-950/40">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">2. Debt Burden (DTI)</span>
                  <div className="text-right">
                    <span className={`font-bold font-mono text-sm ${
                      simResult.scenario.dti_ratio > 35 ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-white"
                    }`}>
                      {simResult.scenario.dti_ratio}%
                    </span>
                    <span className="text-[10px] text-slate-500 block font-medium">New Total EMI: ₹{simResult.scenario.monthly_emi.toLocaleString("en-IN")}/mo</span>
                  </div>
                </div>

                {/* 3. Investment Contribution */}
                <div className="flex items-center justify-between py-1.5 border-b border-indigo-100 dark:border-indigo-950/40">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">3. Investment Contribution</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                      ₹{simResult.scenario.monthly_investments.toLocaleString("en-IN")}/mo
                    </span>
                    <span className="text-[10px] text-slate-500 block font-medium">
                      {simResult.scenario.monthly_investments > simResult.baseline.monthly_investments ? "+₹5,000 Step Up" : "Unchanged"}
                    </span>
                  </div>
                </div>

                {/* 4. Goal Timeline */}
                <div className="flex items-center justify-between py-1.5 border-b border-indigo-100 dark:border-indigo-950/40">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">4. Goal Timeline</span>
                  <div className="text-right">
                    <span className={`font-bold ${
                      simResult.scenario.goal_timeline.includes("Accelerated")
                        ? "text-emerald-600 dark:text-emerald-400"
                        : simResult.scenario.goal_timeline.includes("Delayed")
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-900 dark:text-white"
                    }`}>
                      {simResult.scenario.goal_timeline}
                    </span>
                    <span className="text-[10px] text-slate-500 block font-medium">Impact on House milestone</span>
                  </div>
                </div>

                {/* 5. Financial Health */}
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">5. Financial Health</span>
                  <div className="text-right">
                    <span className={`font-black text-sm ${
                      simResult.scenario.financial_health_score >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                    }`}>
                      {simResult.scenario.financial_health_score} / 100
                    </span>
                    <span className="text-[10px] text-slate-500 block font-medium">
                      {simResult.impact.health_score_change >= 0 ? `+${simResult.impact.health_score_change} pts` : `${simResult.impact.health_score_change} pts`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Controls & Inputs */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Custom Simulation Levers</h2>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Income Delta: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{params.income_change_pct}%</span>
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
              Additional SIP: <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">₹{params.additional_sip.toLocaleString("en-IN")}</span>
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
              New Loan / Purchase Price (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 1000000"
              value={params.purchase_price || ""}
              onChange={(e) => handleParamChange("purchase_price", e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* AI CFO Verdict & 5-Year Trajectory */}
      {simResult && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 flex items-start gap-3 shadow-sm transition-colors">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-slate-900 dark:text-white block">AI CFO Scenario Assessment:</span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{simResult.recommendation}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-3 transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">5-Year Net Worth Wealth Trajectory Comparison</h2>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simResult.projection_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.6} />
                  <XAxis dataKey="year" stroke={textStroke} fontSize={11} />
                  <YAxis stroke={textStroke} fontSize={11} tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} />
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
        </div>
      )}
    </div>
  );
}
