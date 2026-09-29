import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Target, Plus, CheckCircle2, AlertTriangle, ArrowRight, Trash2, Calendar, TrendingUp, X, Sparkles } from "lucide-react";
import { api } from "../api";

export default function GoalsPage() {
  const navigate = useNavigate();
  const [goalsData, setGoalsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    target_amount: "",
    current_amount: "",
    target_date: "2031-12-31",
    target_years: 5,
    monthly_contribution: "",
    return_assumption: 11.5,
    category: "Milestone",
    priority: "High",
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.getGoals();
      setGoalsData(res);
    } catch (err) {
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      await api.createGoal({
        name: formData.name,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount || 0),
        target_date: formData.target_date,
        target_years: parseFloat(formData.target_years),
        monthly_contribution: parseFloat(formData.monthly_contribution || 0),
        return_assumption: parseFloat(formData.return_assumption || 11.0),
        category: formData.category,
        priority: formData.priority,
      });
      setModalOpen(false);
      setFormData({
        name: "",
        target_amount: "",
        current_amount: "",
        target_date: "2031-12-31",
        target_years: 5,
        monthly_contribution: "",
        return_assumption: 11.5,
        category: "Milestone",
        priority: "High",
      });
      fetchGoals();
    } catch (err) {
      alert("Failed to save goal: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this financial goal?")) return;
    try {
      await api.deleteGoal(id);
      fetchGoals();
    } catch (err) {
      alert("Failed to delete goal: " + err.message);
    }
  };

  const handleAskContextual = (query) => {
    navigate("/ai-cfo", { state: { prefilled: query } });
  };

  if (loading || !goalsData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Computing goal projections and required SIP formulas...</p>
      </div>
    );
  }

  const { goals, total_target, total_current, total_projected, total_monthly_allocated, total_monthly_required, overall_progress, on_track_count, total_goals_count } = goalsData;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Financial Goals Engine</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compound interest projections, shortfall gap calculations and required monthly SIP calibration
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Section 12: AI CFO GOAL INSIGHT BANNER */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/60 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-600/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                ✦ AI CFO GOAL INSIGHT
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
              "Based on your current contribution pattern, your emergency-fund goal is progressing steadily."
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAskContextual("Am I on track for my financial goal?")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white whitespace-nowrap shadow-sm transition"
        >
          <span>Ask AI CFO About My Goals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">TOTAL GOALS TARGET</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">₹{(total_target / 10000000).toFixed(2)} Cr</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{total_goals_count} Tracked Milestones</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">CURRENT SAVED CORPUS</div>
          <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">₹{(total_current / 100000).toFixed(1)} Lakhs</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{overall_progress}% Achieved overall</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">PROJECTED CORPUS</div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₹{(total_projected / 10000000).toFixed(2)} Cr</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">At stated CAGR assumptions</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">ON-TRACK STATUS</div>
          <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {on_track_count} of {total_goals_count} On Track
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Required SIP: ₹{total_monthly_required.toLocaleString("en-IN")}/mo</div>
        </div>
      </div>

      {/* Section 12: Realistic Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((g) => {
          return (
            <div
              key={g.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border ${
                g.on_track
                  ? "border-slate-200 dark:border-slate-800"
                  : "border-amber-300 dark:border-amber-500/40"
              } shadow-sm dark:shadow-xl flex flex-col justify-between space-y-4 transition-colors`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {g.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        g.priority === "High" ? "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20" : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                      }`}>
                        {g.priority} Priority
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">{g.name}</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {g.on_track ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        On Track
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-500/20">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Shortfall Gap
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(g.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 transition"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 mt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{g.progress_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        g.on_track ? "bg-indigo-600 dark:bg-indigo-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min(100, g.progress_pct)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Financial details table */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Target Amount</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {g.target_amount >= 10000000
                        ? `₹${(g.target_amount / 10000000).toFixed(1)} Cr`
                        : `₹${(g.target_amount / 100000).toFixed(1)} Lakhs`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Current Amount</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 font-mono">
                      ₹{g.current_amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Projected Corpus</span>
                    <span className={`font-bold font-mono ${g.on_track ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                      {g.projected_corpus >= 10000000
                        ? `₹${(g.projected_corpus / 10000000).toFixed(2)} Cr`
                        : `₹${(g.projected_corpus / 100000).toFixed(1)} Lakhs`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Target Date</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {g.target_date} ({g.target_years} yrs)
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom SIP Recommendation Box */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">Current Monthly SIP</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    ₹{g.monthly_contribution.toLocaleString("en-IN")}/mo
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-indigo-700 dark:text-indigo-400 block font-bold">Required Monthly Contribution</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-300 font-mono">
                    ₹{g.required_monthly_contribution.toLocaleString("en-IN")}/mo
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 19: Contextual AI Questions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-slate-900 dark:text-white">Contextual Goal Questions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAskContextual("Am I on track for my financial goal?")}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 dark:bg-slate-800 dark:hover:bg-indigo-950/40 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
          >
            "Am I on track?"
          </button>
          <button
            onClick={() => handleAskContextual("What happens if I increase my SIP by ₹5,000?")}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 dark:bg-slate-800 dark:hover:bg-indigo-950/40 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
          >
            "How much should I save monthly?"
          </button>
        </div>
      </div>

      {/* Add Goal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative transition-colors">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Create New Financial Goal</h2>

            <form onSubmit={handleAddGoal} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Higher Education, Vacation Fund"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 1000000"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Current Saved (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Target Horizon (Years)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.target_years}
                    onChange={(e) => setFormData({ ...formData, target_years: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Expected Return (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.return_assumption}
                    onChange={(e) => setFormData({ ...formData, return_assumption: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Monthly SIP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000"
                    value={formData.monthly_contribution}
                    onChange={(e) => setFormData({ ...formData, monthly_contribution: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
