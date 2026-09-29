import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart as PieIcon, Plus, TrendingUp, ShieldCheck, ArrowUpRight, Trash2, X, AlertCircle, Sparkles, Target, ArrowRight } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend
} from "recharts";
import { api } from "../api";
import { useTheme } from "../context/ThemeContext";

export default function InvestmentsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    asset_class: "Equity",
    sector: "Diversified Equity",
    invested_amount: "",
    current_value: "",
    monthly_sip: "",
  });

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const res = await api.getInvestments();
      setData(res);
    } catch (err) {
      console.error("Error fetching investments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHolding = async (e) => {
    e.preventDefault();
    try {
      await api.createInvestment({
        name: formData.name,
        asset_class: formData.asset_class,
        sector: formData.sector,
        invested_amount: parseFloat(formData.invested_amount),
        current_value: parseFloat(formData.current_value),
        monthly_sip: parseFloat(formData.monthly_sip || 0),
      });
      setModalOpen(false);
      setFormData({
        name: "",
        asset_class: "Equity",
        sector: "Diversified Equity",
        invested_amount: "",
        current_value: "",
        monthly_sip: "",
      });
      fetchInvestments();
    } catch (err) {
      alert("Failed to add holding: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this holding from your portfolio?")) return;
    try {
      await api.deleteInvestment(id);
      fetchInvestments();
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleAskContextual = (query) => {
    navigate("/ai-cfo", { state: { prefilled: query } });
  };

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading investment portfolio & goal linkages...</p>
      </div>
    );
  }

  const { summary, holdings } = data;
  const { total_invested, total_current_value, total_returns, total_returns_pct, monthly_sip_total, asset_allocation, performance_history } = summary;

  const gridStroke = isDark ? "#334155" : "#E2E8F0";
  const textStroke = isDark ? "#94A3B8" : "#64748B";
  const tooltipBg = isDark ? "#0F172A" : "#FFFFFF";
  const tooltipBorder = isDark ? "#334155" : "#E2E8F0";
  const tooltipColor = isDark ? "#F8FAFC" : "#0F172A";

  // Goal-linked mapping as specified by Section 10
  const goalLinkedHoldings = [
    { name: "UTI Nifty 50 Index Fund", monthly_sip: 10000, linked_goal: "House Down Payment (2033)", allocation_role: "Core Wealth Compounding" },
    { name: "Parag Parikh Flexi Cap Fund", monthly_sip: 8000, linked_goal: "Early Financial Independence (2056)", allocation_role: "Global Diversified Growth" },
    { name: "Bharat Bond ETF / Debt", monthly_sip: 3000, linked_goal: "House Down Payment Capital Protection", allocation_role: "Low-Volatility Debt" },
    { name: "Sovereign Gold Bonds (SGB)", monthly_sip: 2000, linked_goal: "Long-Term Sovereign Hedge", allocation_role: "Inflation Hedge" },
    { name: "HDFC Liquid Fund / FD", monthly_sip: 2000, linked_goal: "Emergency Fund Buffer", allocation_role: "Immediate Liquidity Pool" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Investment Intelligence</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            How do my investments fit into my overall financial plan? Multi-asset allocation, performance, and goal alignment.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Holding</span>
        </button>
      </div>

      {/* Section 10: AI CFO INSIGHT BANNER */}
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
              "Your ₹25,000 monthly investment contribution is currently supported by your positive cash flow and should be evaluated alongside your financial goals."
            </p>
          </div>
        </div>

        <button
          onClick={() => handleAskContextual("What if I increase my SIP by ₹5,000?")}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white whitespace-nowrap shadow-sm transition"
        >
          <span>Ask AI CFO About My Investments</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">PORTFOLIO VALUE</div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">₹{total_current_value.toLocaleString("en-IN")}</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">₹{(total_current_value/100000).toFixed(1)} Lakhs current valuation</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">TOTAL INVESTED</div>
          <div className="text-xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">₹{total_invested.toLocaleString("en-IN")}</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Net principal invested</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">TOTAL RETURNS</div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4" />
            +₹{total_returns.toLocaleString("en-IN")}
          </div>
          <div className="text-[10px] text-emerald-600/90 dark:text-emerald-400/80 mt-0.5">+{total_returns_pct}% total unrealized gains</div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase">MONTHLY SIP</div>
          <div className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">₹{monthly_sip_total.toLocaleString("en-IN")}/mo</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">20.8% of post-tax salary</div>
        </div>
      </div>

      {/* Row: Asset Allocation & Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Class Allocation */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Multi-Asset Allocation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={asset_allocation}
                    dataKey="percentage"
                    nameKey="asset_class"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {asset_allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipColor, borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(val, name) => [`${val}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5">
              {asset_allocation.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.asset_class}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-900 dark:text-white font-bold">₹{item.value.toLocaleString("en-IN")}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio Growth History */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">6-Month Portfolio Performance vs Capital Invested</h2>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performance_history}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.6} />
                <XAxis dataKey="month" stroke={textStroke} fontSize={11} />
                <YAxis
                  stroke={textStroke}
                  fontSize={11}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: tooltipBg, borderColor: tooltipBorder, color: tooltipColor, borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(val, name) => [`₹${Number(val).toLocaleString("en-IN")}`, name]}
                />
                <Area type="monotone" dataKey="value" name="Current Value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="invested" name="Invested Capital" stroke={textStroke} fill={textStroke} fillOpacity={0.1} strokeWidth={1.5} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Section 10: Goal-Linked Investments Breakdown */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Goal-Linked Investment Mapping</h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Monthly SIP: ₹25,000</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {goalLinkedHoldings.map((g, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <div className="flex items-start justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{g.name}</span>
                <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">₹{g.monthly_sip.toLocaleString("en-IN")}/mo</span>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Linked Goal</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{g.linked_goal}</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Role: {g.allocation_role}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Holdings Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-xl transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Current Portfolio Holdings</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">{holdings.length} Active Holdings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                <th className="py-3 px-4">Instrument Name</th>
                <th className="py-3 px-4">Asset Class</th>
                <th className="py-3 px-4">Sector / Category</th>
                <th className="py-3 px-4 text-right">Invested</th>
                <th className="py-3 px-4 text-right">Current Value</th>
                <th className="py-3 px-4 text-right">Returns</th>
                <th className="py-3 px-4 text-right">Monthly SIP</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
              {holdings.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{h.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {h.asset_class}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{h.sector}</td>
                  <td className="py-3 px-4 text-right font-mono">₹{h.invested_amount.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">₹{h.current_value.toLocaleString("en-IN")}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    +{h.returns_percentage}%
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                    {h.monthly_sip > 0 ? `₹${h.monthly_sip.toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(h.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-500 transition"
                      title="Delete Holding"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 19: Contextual AI Questions */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-slate-900 dark:text-white">Contextual Investment Questions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAskContextual("What if I increase my SIP by ₹5,000?")}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 dark:bg-slate-800 dark:hover:bg-indigo-950/40 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
          >
            "What if I increase my SIP?"
          </button>
          <button
            onClick={() => handleAskContextual("Am I on track for my financial goal?")}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 dark:bg-slate-800 dark:hover:bg-indigo-950/40 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
          >
            "How does this affect my goals?"
          </button>
        </div>
      </div>

      {/* Add Holding Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative transition-colors">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">Add Portfolio Holding</h2>

            <form onSubmit={handleAddHolding} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Fund or Stock Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mirae Asset Large Cap Fund"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Asset Class</label>
                  <select
                    value={formData.asset_class}
                    onChange={(e) => setFormData({ ...formData, asset_class: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  >
                    <option>Equity</option>
                    <option>Debt</option>
                    <option>Gold</option>
                    <option>Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Sector / Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Technology, Index, Liquid"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Invested Capital (₹)</label>
                  <input
                    type="number"
                    value={formData.invested_amount}
                    onChange={(e) => setFormData({ ...formData, invested_amount: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Current Valuation (₹)</label>
                  <input
                    type="number"
                    value={formData.current_value}
                    onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Monthly SIP (₹) (Optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={formData.monthly_sip}
                  onChange={(e) => setFormData({ ...formData, monthly_sip: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
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
                  Add Holding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
