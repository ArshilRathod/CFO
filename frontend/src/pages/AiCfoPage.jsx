import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Send,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  Trash2,
  HelpCircle,
  Cpu,
  Layers,
  Check,
  AlertTriangle,
  RotateCcw,
  Info
} from "lucide-react";
import { api } from "../api";

export default function AiCfoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTechnicalFlow, setShowTechnicalFlow] = useState(false);
  const chatEndRef = useRef(null);

  // Section 14: Exact Suggested Questions
  const suggestedQuestions = [
    "Can I afford a ₹10 lakh car next year?",
    "Why did my expenses increase this month?",
    "Am I on track for my financial goal?",
    "What happens if I increase my SIP by ₹5,000?",
    "Can I take another loan?",
    "Where can I reduce my spending?",
  ];

  useEffect(() => {
    loadChatHistory();
  }, []);

  // Handle prefilled query passed via React Router navigation
  useEffect(() => {
    if (location.state && location.state.prefilled) {
      handleSend(location.state.prefilled);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const loadChatHistory = async () => {
    try {
      const history = await api.getChatHistory();
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Hero welcome message demonstrating the exact pipeline
        setMessages([
          {
            role: "assistant",
            user_query: null,
            message:
              "Welcome to AI CFO. I am your Personal Financial Intelligence decision-support system. Ask me questions about large purchases, expense anomalies, loan capacity, or goal projections. I verify calculations through backend financial engines before explaining trade-offs in natural language.",
            insight: "System connected to your verified master financial profile.",
            why: "Financial engines calculate deterministically; AI reasons over verified results; Natural language communicates explanations.",
            data_used: {
              "Monthly Income": "₹1,20,000",
              "Living Expenses": "₹58,000",
              "Existing EMI": "₹12,000",
              "Monthly SIP": "₹25,000",
              "Current Surplus": "₹25,000 (20.8% Surplus Rate)",
              "Financial Health": "82 / 100"
            },
            financial_analysis: {
              "Free Cash Buffer": "₹25,000/month free surplus",
              "Debt Servicing": "₹12,000/month (10.0% DTI)",
              "Investment Inflow": "₹25,000/month automated SIP",
              "Reserve Runway": "5.4 months essential expenses"
            },
            what_if_options: null,
            goal_impact_badge: "MAINTAINS",
            goal_impact_text: "Current financial baseline maintains stable cash flow and steady goal progression.",
            assumptions: ["All calculations are grounded in your verified 6-month transaction ledger."],
            possible_actions: [
              { label: "Check Affordability of ₹10L Car", action: "prompt", query: "Can I afford a ₹10 lakh car next year?" },
              { label: "Analyze Spending Anomalies", action: "prompt", query: "Why did my expenses increase this month?" },
              { label: "Evaluate Additional Loan Capacity", action: "prompt", query: "Can I take another loan?" }
            ],
            suggested_followups: [
              "Can I afford a ₹10 lakh car next year?",
              "Why did my expenses increase this month?",
              "Can I take another loan?"
            ]
          }
        ]);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
    }
  };

  const handleSend = async (questionText) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: "user", message: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.sendChatMessage(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          user_query: res.user_query || textToSend,
          message: res.message,
          insight: res.insight,
          why: res.why,
          data_used: res.data_used,
          financial_analysis: res.financial_analysis,
          what_if_options: res.what_if_options,
          goal_impact_badge: res.goal_impact_badge,
          goal_impact_text: res.goal_impact_text,
          assumptions: res.assumptions,
          possible_actions: res.possible_actions,
          suggested_followups: res.suggested_followups,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: "Encountered an issue querying financial calculation engine: " + err.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Clear AI CFO conversation history?")) return;
    try {
      await api.clearChatHistory();
      setMessages([]);
      loadChatHistory();
    } catch (err) {
      alert("Failed to clear chat: " + err.message);
    }
  };

  const handleActionClick = (act) => {
    if (act.action === "navigate") {
      navigate(act.target);
    } else if (act.action === "prompt") {
      handleSend(act.query);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] max-w-5xl mx-auto space-y-3.5">
      {/* Section 14: Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-shrink-0 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/25 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">AI CFO</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                Personal Financial Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ask questions about your finances and get answers grounded in your financial data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTechnicalFlow(!showTechnicalFlow)}
            className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-800 transition"
            title="View technical pipeline architecture"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{showTechnicalFlow ? "Hide Technical Flow" : "Technical Flow"}</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Reset conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Section 16: AI CFO Technical Flow Banner (Collapsible / Interactive) */}
      {showTechnicalFlow && (
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white border border-indigo-500/30 shadow-xl space-y-2 text-xs flex-shrink-0 animate-in fade-in">
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" />
              Section 16: AI CFO Technical Architecture Pipeline
            </span>
            <span className="text-[10px] text-slate-400">Deterministic Engine + AI Reasoning + LLM Explanation</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-300 font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">USER QUERY</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-indigo-900/60 border border-indigo-700/60 text-indigo-200">INTENT UNDERSTANDING</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-indigo-900/60 border border-indigo-700/60 text-indigo-200">USER DATA RETRIEVAL</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-700/60 text-purple-200">FINANCIAL CALCULATION</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-purple-900/60 border border-purple-700/60 text-purple-200">AI REASONING</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700/60 text-emerald-200">EXPLANATION</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700/60 text-blue-200">WHAT-IF SIMULATION</span>
            <span>→</span>
            <span className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700/60 text-emerald-200">GOAL-AWARE GUIDANCE</span>
          </div>
        </div>
      )}

      {/* Section 14: Suggested Questions Carousel / Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 flex-shrink-0 no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-indigo-50 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-500/50 text-xs font-semibold text-slate-700 hover:text-indigo-700 dark:text-slate-300 dark:hover:text-white transition shadow-xs whitespace-nowrap active:scale-95"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";

          if (isUser) {
            return (
              <div key={idx} className="flex justify-end">
                <div className="max-w-xl bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20">
                  <div className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider mb-0.5">
                    USER QUESTION
                  </div>
                  {m.message}
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className="space-y-3 max-w-4xl">
              {/* Natural Language Explanation Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm dark:shadow-xl space-y-2.5 transition-colors">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                      AI
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      AI CFO EXPLANATION
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 font-bold">
                    Reasoned Over Verified Calculation
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  {m.message}
                </p>
              </div>

              {/* Section 15: AI CFO ANALYSIS (Show financial data used) */}
              {m.data_used && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        AI CFO ANALYSIS — RELEVANT DATA RETRIEVED
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase border border-slate-200 dark:border-slate-700">
                      [ACTUAL DATA]
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
                    {Object.entries(m.data_used).map(([k, v], i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate font-medium">{k}</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 15: FINANCIAL ANALYSIS (Calculate: Estimated EMI, Surplus, Debt Impact, Goal Impact) */}
              {m.financial_analysis && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 shadow-md space-y-3 transition-colors">
                  <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        FINANCIAL ANALYSIS (CALCULATED BY ENGINE)
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold uppercase border border-indigo-200 dark:border-indigo-500/30">
                      [SIMULATION DATA]
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(m.financial_analysis).map(([label, val], i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-start justify-between text-xs gap-3">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{label}:</span>
                        <span className="font-bold text-slate-900 dark:text-white font-mono text-right">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Goal Impact Section */}
                  {m.goal_impact_text && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/40 dark:from-slate-950 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5 text-xs">
                      <div className="mt-0.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          m.goal_impact_badge === "IMPROVES"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300"
                            : m.goal_impact_badge === "MAINTAINS"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-300"
                        }`}>
                          GOAL IMPACT: {m.goal_impact_badge}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                        {m.goal_impact_text}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Section 15: WHAT-IF OPTIONS (₹8L, ₹10L, ₹12L comparison) */}
              {m.what_if_options && m.what_if_options.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      WHAT-IF SCENARIO COMPARISON OPTIONS
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-500/30">
                      Interactive Options
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {m.what_if_options.map((opt, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2 text-xs hover:border-indigo-400 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">{opt.option}</span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                            opt.goal_impact === "IMPROVES"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400"
                              : opt.goal_impact === "MAINTAINS"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400"
                          }`}>
                            {opt.goal_impact}
                          </span>
                        </div>

                        <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300 font-mono">
                          {opt.estimated_emi && <div>EMI: <strong className="text-slate-900 dark:text-white">{opt.estimated_emi}</strong></div>}
                          {opt.projected_surplus && <div>Surplus: <strong className="text-emerald-600 dark:text-emerald-400">{opt.projected_surplus}</strong></div>}
                          {opt.debt_impact && <div>DTI: <strong>{opt.debt_impact}</strong></div>}
                        </div>

                        <p className="text-[11px] text-slate-500 leading-normal pt-1 border-t border-slate-200 dark:border-slate-800">
                          {opt.recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Next Actions */}
              {m.possible_actions && m.possible_actions.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Step:</span>
                  {m.possible_actions.map((act, i) => (
                    <button
                      key={i}
                      onClick={() => handleActionClick(act)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition active:scale-95"
                    >
                      <span>{act.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              )}

              {/* Suggested Followups */}
              {m.suggested_followups && m.suggested_followups.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Explore further:</span>
                  {m.suggested_followups.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(f)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline font-medium"
                    >
                      "{f}"
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 shadow-sm max-w-md">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span>AI CFO querying calculation engines & evaluating trade-offs...</span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Section 14: Large Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-2xl flex-shrink-0 transition-colors"
      >
        <input
          type="text"
          placeholder="Ask AI CFO anything about your finances (e.g. Can I afford a ₹10 lakh car next year?)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-40 shadow-md shadow-indigo-600/30 flex items-center justify-center"
          title="Send Query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
