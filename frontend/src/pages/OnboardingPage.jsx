import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Shield, User, Wallet, Target, Compass, Lock } from "lucide-react";
import { api } from "../api";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal
    age: 25,
    employment: "Salaried Professional",
    monthly_income: 120000,
    dependents: 0,

    // Step 2: Financial
    savings: 350000,
    monthly_expenses: 58000,
    monthly_investments: 25000,
    total_investments: 1420000,
    total_loans: 380000,

    // Step 3: Goals
    goals_selected: ["Emergency fund", "Car", "House", "Retirement"],

    // Step 4: Risk
    risk_preference: "Moderate",

    // Step 5: Consent
    consent_given: true,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleGoal = (goal) => {
    setFormData((prev) => {
      const exists = prev.goals_selected.includes(goal);
      return {
        ...prev,
        goals_selected: exists
          ? prev.goals_selected.filter((g) => g !== goal)
          : [...prev.goals_selected, goal],
      };
    });
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      await api.updateProfile({
        age: parseInt(formData.age),
        employment: formData.employment,
        monthly_income: parseFloat(formData.monthly_income),
        dependents: parseInt(formData.dependents),
        savings: parseFloat(formData.savings),
        monthly_expenses: parseFloat(formData.monthly_expenses),
        monthly_investments: parseFloat(formData.monthly_investments),
        total_investments: parseFloat(formData.total_investments),
        total_loans: parseFloat(formData.total_loans),
        risk_preference: formData.risk_preference,
        consent_given: formData.consent_given,
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Error saving profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, title: "Personal", icon: User },
    { num: 2, title: "Finances", icon: Wallet },
    { num: 3, title: "Goals", icon: Target },
    { num: 4, title: "Risk Appetite", icon: Compass },
    { num: 5, title: "Consent & Build", icon: Shield },
  ];

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Progress header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Setup Your Financial Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Step {step} of 5 — AI CFO configures your calculation baseline and risk parameters.
        </p>

        <div className="flex items-center justify-between mt-6 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0"></div>
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition ${
                    isCompleted
                      ? "bg-emerald-500 text-white font-bold shadow-xs"
                      : isCurrent
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20 shadow-md shadow-indigo-600/30"
                      : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`text-[11px] font-medium mt-1.5 ${
                    isCurrent ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-xl transition-colors">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleChange("age", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Employment Type</label>
                <select
                  value={formData.employment}
                  onChange={(e) => handleChange("employment", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                >
                  <option>Salaried Professional</option>
                  <option>Self-Employed / Business</option>
                  <option>Freelancer / Consultant</option>
                  <option>Student</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly In-Hand Income (₹)</label>
                <input
                  type="number"
                  value={formData.monthly_income}
                  onChange={(e) => handleChange("monthly_income", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Dependents</label>
                <input
                  type="number"
                  value={formData.dependents}
                  onChange={(e) => handleChange("dependents", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Financial Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Liquid Savings / Emergency Fund (₹)</label>
                <input
                  type="number"
                  value={formData.savings}
                  onChange={(e) => handleChange("savings", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
                <span className="text-[11px] text-slate-500">Bank accounts, auto-sweep FD, liquid funds</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Living Expenses (₹)</label>
                <input
                  type="number"
                  value={formData.monthly_expenses}
                  onChange={(e) => handleChange("monthly_expenses", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
                <span className="text-[11px] text-slate-500">Rent, groceries, utilities, shopping</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Existing Investments (₹)</label>
                <input
                  type="number"
                  value={formData.total_investments}
                  onChange={(e) => handleChange("total_investments", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Outstanding Loans (₹)</label>
                <input
                  type="number"
                  value={formData.total_loans}
                  onChange={(e) => handleChange("total_loans", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Select Your Key Milestones</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose all objectives you want your AI CFO to monitor:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { name: "Emergency fund", desc: "6 Months essential buffer", target: "₹3.5 Lakh" },
                { name: "Car", desc: "Purchase or vehicle upgrade", target: "₹15 Lakh in 3 yrs" },
                { name: "House", desc: "Real estate down payment", target: "₹40 Lakh in 7 yrs" },
                { name: "Retirement", desc: "Early financial independence", target: "₹3 Crore in 30 yrs" },
                { name: "Education", desc: "Higher studies / certifications", target: "₹10 Lakh in 4 yrs" },
              ].map((g) => {
                const active = formData.goals_selected.includes(g.name);
                return (
                  <button
                    key={g.name}
                    type="button"
                    onClick={() => toggleGoal(g.name)}
                    className={`p-4 rounded-xl text-left border transition flex items-start justify-between ${
                      active
                        ? "bg-indigo-50/80 border-indigo-500 text-slate-900 dark:bg-indigo-950/40 dark:border-indigo-500 dark:text-white"
                        : "bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-950/60 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{g.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{g.desc}</div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-2 font-bold">{g.target}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        active
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {active && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Investment Risk Preference</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { type: "Conservative", desc: "Capital preservation prioritized. Higher debt and FD ratio (6-8% return assumption)." },
                { type: "Moderate", desc: "Balanced growth and volatility tolerance. Multi-asset index and flexi-cap focus (10-12% return)." },
                { type: "Aggressive", desc: "High equity allocation, mid/small-cap exposure for accelerated wealth compounding (13-15% return)." },
              ].map((r) => {
                const active = formData.risk_preference === r.type;
                return (
                  <button
                    key={r.type}
                    type="button"
                    onClick={() => handleChange("risk_preference", r.type)}
                    className={`p-4 rounded-xl text-left border transition flex flex-col justify-between ${
                      active
                        ? "bg-indigo-50 border-indigo-500 text-slate-900 ring-1 ring-indigo-500 dark:bg-indigo-950/40 dark:border-indigo-500 dark:text-white"
                        : "bg-slate-50/70 hover:bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-950/60 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{r.type}</div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{r.desc}</p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                      {active ? "Selected" : "Select"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Consent & Profile Initialization</h2>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-slate-900 dark:text-white">Prototype Data Usage Notice:</span> This application is an engineering MVP built for the Smart India Hackathon (SIH) prototype demonstration. It uses the financial parameters provided to calculate personalized cash flow metrics, net worth, risk alerts, and what-if simulations through backend algorithmic functions.
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={formData.consent_given}
                  onChange={(e) => handleChange("consent_given", e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                />
                <label htmlFor="consent" className="text-xs text-slate-800 dark:text-slate-300 font-semibold cursor-pointer">
                  I consent to using this simulated financial profile for AI CFO intelligence and calculations.
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div className="font-bold text-indigo-700 dark:text-indigo-300">Baseline Ready to Initialize:</div>
              <div>Monthly Income: ₹{Number(formData.monthly_income).toLocaleString("en-IN")}</div>
              <div>Monthly Expenses: ₹{Number(formData.monthly_expenses).toLocaleString("en-IN")}</div>
              <div>Risk Profile: {formData.risk_preference}</div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>
          ) : (
            <div></div>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition"
            >
              Next Step
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || !formData.consent_given}
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {loading ? "Initializing..." : "Create My Financial Profile"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
