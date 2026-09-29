import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, ArrowRight, Calculator, ShieldCheck, TrendingDown, DollarSign, Calendar, Sparkles, AlertCircle } from "lucide-react";
import { api } from "../api";

export default function LoansPage() {
  const navigate = useNavigate();
  const [loansData, setLoansData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Repayment Calculator State
  const [calcEmi, setCalcEmi] = useState(15000);
  const [calcRate, setCalcRate] = useState(9.5);
  const [calcTenure, setCalcTenure] = useState(36);
  const [mode, setMode] = useState("emi");
  const [simResult, setSimResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await api.getLoans();
      setLoansData(res);
      if (res.loans && res.loans.length > 0) {
        const first = res.loans[0];
        setCalcRate(first.interest_rate);
        setCalcEmi(first.emi + 3000);
        runSim(first.outstanding_balance, first.interest_rate, first.emi + 3000, null);
      }
    } catch (err) {
      console.error("Error fetching loans:", err);
    } finally {
      setLoading(false);
    }
  };

  const runSim = async (principal, rate, emi, tenure) => {
    try {
      setSimulating(true);
      const res = await api.simulateLoan({
        principal: principal,
        interest_rate: rate,
        emi: mode === "emi" ? emi : null,
        tenure_months: mode === "tenure" ? tenure : null,
      });
      setSimResult(res);
    } catch (err) {
      console.error("Error simulating loan:", err);
    } finally {
      setSimulating(false);
    }
  };

  const handleRecalculate = (e) => {
    e.preventDefault();
    if (!loansData || !loansData.loans.length) return;
    const l = loansData.loans[0];
    runSim(l.outstanding_balance, parseFloat(calcRate), parseFloat(calcEmi), parseInt(calcTenure));
  };

  const handleAskContextual = (query) => {
    navigate("/ai-cfo", { state: { prefilled: query } });
  };

  if (loading || !loansData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading loan debt liabilities & servicing capacity...</p>
      </div>
    );
  }

  const { total_outstanding, total_emi, dti_ratio, loans } = loansData;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Loans & Debt Engine</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Current debt obligations, DTI capacity analysis, and interactive prepayment optimizer
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            ✓ 10.0% DTI (Safe &lt; 35%)
          </span>
        </div>
      </div>

      {/* Section 11: AI CFO INSIGHT BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/60 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-600/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                ✦ AI CFO INSIGHT
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              "Your existing ₹12,000 EMI represents 10% of your monthly post-tax income."
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAskContextual("Can I take another loan?")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white whitespace-nowrap shadow-sm transition"
        >
          <span>Ask AI CFO About My Debt Capacity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">OUTSTANDING DEBT</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">₹{total_outstanding.toLocaleString("en-IN")}</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Across {loans.length} active credit facility</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">MONTHLY EMI</div>
          <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">₹{total_emi.toLocaleString("en-IN")}/mo</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Contractual auto-debit on 5th</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">DEBT-TO-INCOME (DTI)</div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{dti_ratio}%</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Safe benchmark ceiling is 35%</div>
        </div>
      </div>

      {/* Section 11: Distinctly labeled EXISTING OBLIGATION Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-xl transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 uppercase">
              EXISTING OBLIGATION
            </span>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Loan Facilities</h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Current Monthly EMI: ₹12,000</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                <th className="py-3 px-4">Loan Title</th>
                <th className="py-3 px-4 text-right">Principal</th>
                <th className="py-3 px-4 text-right">Outstanding</th>
                <th className="py-3 px-4 text-center">Interest Rate</th>
                <th className="py-3 px-4 text-right">Monthly EMI</th>
                <th className="py-3 px-4 text-center">Tenure Left</th>
                <th className="py-3 px-4 text-right">Est. Interest Left</th>
                <th className="py-3 px-4 text-center">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
              {loans.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{l.name}</td>
                  <td className="py-3.5 px-4 text-right font-mono">₹{l.principal.toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-600 dark:text-amber-400">
                    ₹{l.outstanding_balance.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono">{l.interest_rate}%</td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white">
                    ₹{l.emi.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-center">{l.remaining_tenure_months} months</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500 dark:text-slate-400">
                    ₹{l.total_interest_estimated.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${l.progress_pct}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{l.progress_pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 11: POTENTIAL NEW OBLIGATION / Prepayment Optimizer */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-500/30 uppercase">
                POTENTIAL NEW OBLIGATION / SIMULATION
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Repayment Scenario Optimizer</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate prepaying an extra amount or adjusting tenure to compute interest savings without modifying real accounts
            </p>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setMode("emi")}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                mode === "emi" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Adjust EMI
            </button>
            <button
              onClick={() => setMode("tenure")}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                mode === "tenure" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Adjust Tenure
            </button>
          </div>
        </div>

        <form onSubmit={handleRecalculate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {mode === "emi" ? (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                New Monthly EMI (₹) (Current: ₹12,000)
              </label>
              <input
                type="number"
                value={calcEmi}
                onChange={(e) => setCalcEmi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Try ₹15,000 (₹3,000 extra prepayment per month)
              </span>
            </div>
          ) : (
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                Target Tenure (Months) (Current: 36)
              </label>
              <input
                type="number"
                value={calcTenure}
                onChange={(e) => setCalcTenure(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Try 24 months to pay off a year sooner
              </span>
            </div>
          )}

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">Interest Rate (%)</label>
            <input
              type="number"
              step="0.1"
              value={calcRate}
              onChange={(e) => setCalcRate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-sm outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Simulate bank rate cuts or refinance</span>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={simulating}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/25"
            >
              {simulating ? "Calculating..." : "Recalculate Savings"}
            </button>
          </div>
        </form>

        {/* Current vs Scenario Comparison */}
        {simResult && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Loan Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>EXISTING OBLIGATION (BASELINE)</span>
                  <span className="text-[10px] font-mono">Actual</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80 dark:border-slate-900">
                  <span className="text-slate-500 dark:text-slate-400">Monthly EMI</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">₹{simResult.current.emi.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80 dark:border-slate-900">
                  <span className="text-slate-500 dark:text-slate-400">Remaining Tenure</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{simResult.current.tenure_months} months</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/80 dark:border-slate-900">
                  <span className="text-slate-500 dark:text-slate-400">Total Interest to Pay</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400 font-mono">₹{simResult.current.total_interest.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400">Total Outflow</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">₹{simResult.current.total_payable.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Scenario Card */}
              <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/30 space-y-2 text-xs">
                <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center justify-between">
                  <span>POTENTIAL PREPAYMENT SCENARIO</span>
                  <span className="text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-transparent px-1.5 py-0.5 rounded font-bold">SIMULATION</span>
                </div>
                <div className="flex justify-between py-1 border-b border-indigo-100 dark:border-indigo-950/50">
                  <span className="text-slate-600 dark:text-slate-400">New Monthly EMI</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">₹{simResult.scenario.emi.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-indigo-100 dark:border-indigo-950/50">
                  <span className="text-slate-600 dark:text-slate-400">New Remaining Tenure</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{simResult.scenario.tenure_months} months</span>
                </div>
                <div className="flex justify-between py-1 border-b border-indigo-100 dark:border-indigo-950/50">
                  <span className="text-slate-600 dark:text-slate-400">New Total Interest</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono">₹{simResult.scenario.total_interest.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400">Total Outflow</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">₹{simResult.scenario.total_payable.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Impact Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-white to-indigo-50/50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-indigo-950/30 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Prepayment Impact:</div>
                  <div className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">{simResult.comparison.summary}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Net Interest Saved</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ₹{Math.abs(simResult.comparison.interest_saved).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 19: Contextual AI Questions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-slate-900 dark:text-white">Contextual Debt Questions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAskContextual("Can I take another loan?")}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 dark:bg-slate-800 dark:hover:bg-indigo-950/40 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
          >
            "Can I afford another loan?"
          </button>
          <button
            onClick={() => handleAskContextual("What happens if I repay early?")}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 dark:bg-slate-800 dark:hover:bg-indigo-950/40 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
          >
            "What happens if I repay early?"
          </button>
        </div>
      </div>
    </div>
  );
}
