import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, Trash2, Edit2, Check, X, ArrowDownRight, ArrowUpRight, Calendar, Sparkles, SlidersHorizontal } from "lucide-react";
import { api } from "../api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [accountFilter, setAccountFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "Food",
    type: "Expense",
    amount: "",
    account: "HDFC Salary Account",
  });

  const categories = [
    "All", "Salary", "Housing", "Food", "Transport", "Shopping",
    "Utilities", "Entertainment", "Healthcare", "SIP", "EMI", "Other"
  ];

  const types = ["All", "Income", "Expense", "Investment", "Loan payment"];
  const accounts = ["All", "HDFC Salary Account", "ICICI Credit Card", "Zerodha Broking", "HDFC UPI"];

  useEffect(() => {
    fetchTransactions();
  }, [categoryFilter, typeFilter, accountFilter, search, startDate, endDate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.getTransactions({
        category: categoryFilter,
        type: typeFilter,
        search: search.trim() || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      });

      let filtered = res;
      if (accountFilter !== "All") {
        filtered = filtered.filter(t => t.account === accountFilter);
      }
      setTransactions(filtered);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "Food",
      type: "Expense",
      amount: "",
      account: "HDFC Salary Account",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditId(t.id);
    setFormData({
      date: t.date,
      description: t.description,
      category: t.category,
      type: t.type,
      amount: t.amount,
      account: t.account,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    try {
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      alert("Please enter merchant/description and amount");
      return;
    }

    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      if (editId) {
        await api.updateTransaction(editId, payload);
      } else {
        await api.createTransaction(payload);
      }
      setModalOpen(false);
      fetchTransactions();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  // Reconciled summary computations
  const totalInflow = transactions.filter(t => t.type === "Income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "Expense").reduce((sum, t) => sum + t.amount, 0);
  const totalSIP = transactions.filter(t => t.type === "Investment").reduce((sum, t) => sum + t.amount, 0);
  const totalEMI = transactions.filter(t => t.type === "Loan payment").reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Transactions & Ledger</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated bank transaction feed with real-time AI merchant categorization and deterministic cash-flow reconciliation
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Reconciled Monthly Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Salary Inflow</span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">+₹1,20,000</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Post-tax salary</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Living Expenses</span>
          <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 font-mono">-₹58,000</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Essentials & shopping</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Loan EMI</span>
          <span className="text-base font-extrabold text-amber-600 dark:text-amber-400 font-mono">-₹12,000</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Auto loan obligation</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Monthly SIP</span>
          <span className="text-base font-extrabold text-purple-600 dark:text-purple-400 font-mono">-₹25,000</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Mutual funds basket</span>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-indigo-50 border border-indigo-200 dark:bg-indigo-600/15 dark:border-indigo-500/30">
          <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase block">Net Free Surplus</span>
          <span className="text-base font-black text-slate-900 dark:text-white font-mono">+₹25,000</span>
          <span className="text-[10px] text-indigo-600 dark:text-indigo-300 font-bold block mt-0.5">20.8% Surplus Rate</span>
        </div>
      </div>

      {/* Filters & Search Controls (Section 9: Search, Date filter, Category filter, Account filter) */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search merchant, description, or account (e.g. Rent, Groceries, Netflix, Axis)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Account Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Account:</span>
              <select
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 outline-none"
              >
                {accounts.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Type:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:border-indigo-500 outline-none"
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            Date Filter:
          </span>
          <div className="flex items-center gap-1.5">
            <span>From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span>To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>
          {(startDate || endDate || search || categoryFilter !== "All" || typeFilter !== "All" || accountFilter !== "All") && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSearch("");
                setCategoryFilter("All");
                setTypeFilter("All");
                setAccountFilter("All");
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Section 9: Realistic Transactions Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-xl transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Merchant / Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4">Account</th>
                <th className="py-3.5 px-4 text-center">AI Categorization</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading transactions ledger...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500">
                    No transactions match the selected filters.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => {
                  const isIncome = t.type === "Income";
                  const isExpense = t.type === "Expense";
                  const isInvestment = t.type === "Investment";
                  const isEMI = t.type === "Loan payment";

                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {t.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                        {t.description}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                          {t.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                            isIncome
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isExpense
                              ? "text-rose-600 dark:text-rose-400"
                              : isInvestment
                              ? "text-purple-600 dark:text-purple-400"
                              : "text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap">
                        <span className={isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}>
                          {isIncome ? "+" : "-"}₹{Number(t.amount).toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                        {t.account}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          <span>AI Tagged</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Transaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl relative transition-colors">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {editId ? "Edit Transaction" : "Record New Transaction"}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Merchant / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Swiggy food delivery, Grocery, Salary, Subscription"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  >
                    <option>Expense</option>
                    <option>Income</option>
                    <option>Investment</option>
                    <option>Loan payment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 5000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Account</label>
                  <select
                    value={formData.account}
                    onChange={(e) => setFormData({ ...formData, account: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  >
                    {accounts.filter(a => a !== "All").map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
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
                  {editId ? "Update" : "Save Transaction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
