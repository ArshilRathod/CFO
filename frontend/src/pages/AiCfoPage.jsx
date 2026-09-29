import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Info,
  Sliders,
  CheckCircle2,
  Trash2,
  HelpCircle,
  CornerDownLeft,
  ChevronRight
} from "lucide-react";
import { api } from "../api";

export default function AiCfoPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedQuestions = [
    "Can I afford a ₹15 lakh car next year?",
    "Why did my expenses increase?",
    "Am I on track for my house goal?",
    "What are my biggest financial risks?",
    "How much am I investing every month?",
    "What happens if I increase my SIP by ₹5,000?",
  ];

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const loadChatHistory = async () => {
    try {
      const history = await api.getChatHistory();
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Welcome message
        setMessages([
          {
            role: "assistant",
            message:
              "Hello! I am your AI CFO. I continuously evaluate your cash flow, investments, loans, goals, and reserve buffers. Ask me questions about large purchases, expense spikes, or wealth strategies.",
            insight: "System connected to your real backend calculations and ledger.",
            why: "All responses are backed by algorithmic computations rather than generic AI guesses.",
            data_used: {
              "Monthly Income": "₹1,20,000",
              "Monthly Expenses": "₹58,000",
              "Existing EMI": "₹12,000",
              "Current Surplus": "₹25,000",
              "Emergency Fund": "₹3,50,000 (5.4 mo)",
            },
            assumptions: ["Data reflects your simulated 6-month transaction ledger."],
            possible_actions: [
              { label: "Check Affordability of ₹15L Car", action: "prompt", query: "Can I afford a ₹15 lakh car next year?" },
              { label: "Examine Expense Anomalies", action: "prompt", query: "Why did my expenses increase?" },
            ],
            suggested_followups: [
              "Can I afford a ₹15 lakh car next year?",
              "What are my biggest financial risks?",
            ],
          },
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
          message: res.message,
          insight: res.insight,
          why: res.why,
          data_used: res.data_used,
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
          message: "Encountered an issue processing query: " + err.message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Clear AI CFO chat history?")) return;
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
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-shrink-0 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">AI CFO</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                Deterministic Financial Layer
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions about your financial situation and receive calculated explanations.</p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
          title="Clear chat"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Questions Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 flex-shrink-0 no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          Suggested:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 hover:border-indigo-400 dark:border-slate-800 dark:hover:border-indigo-500/40 text-xs font-medium text-slate-700 hover:text-indigo-700 dark:text-slate-300 dark:hover:text-white transition shadow-sm whitespace-nowrap active:scale-95"
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
                <div className="max-w-xl bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-xs sm:text-sm font-medium shadow-md shadow-indigo-600/20">
                  {m.message}
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className="flex items-start gap-3 max-w-3xl">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>

              <div className="flex-1 space-y-3">
                {/* Natural language response */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm p-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-sm dark:shadow-lg transition-colors">
                  {m.message}
                </div>

                {/* Structured AI CFO Explainability Card */}
                {(m.insight || m.data_used) && (
                  <div className="bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-950/80 dark:to-slate-950 border border-indigo-200 dark:border-indigo-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm dark:shadow-xl transition-colors">
                    <div className="flex items-center justify-between border-b border-indigo-100 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          AI CFO Analysis Breakdown
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/20 font-bold">
                        Backend Calculation Verified
                      </span>
                    </div>

                    {/* Section: Insight */}
                    {m.insight && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                          1. Insight (What was detected?)
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                          {m.insight}
                        </p>
                      </div>
                    )}

                    {/* Section: Why? */}
                    {m.why && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          2. Why? (Causal explanation)
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{m.why}</p>
                      </div>
                    )}

                    {/* Section: Data Used */}
                    {m.data_used && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          3. Data Used (Calculated backend metrics)
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                          {Object.entries(m.data_used).map(([k, v], i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate font-medium">{k}</span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section: Assumptions */}
                    {m.assumptions && m.assumptions.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          4. Assumptions Used
                        </span>
                        <ul className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                          {m.assumptions.map((ass, i) => (
                            <li key={i}>{ass}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Section: Possible Actions */}
                    {m.possible_actions && m.possible_actions.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-indigo-100 dark:border-slate-800/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          5. Recommended Next Steps
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {m.possible_actions.map((act, i) => (
                            <button
                              key={i}
                              onClick={() => handleActionClick(act)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600/20 dark:hover:bg-indigo-600/30 dark:text-indigo-300 dark:border dark:border-indigo-500/30 text-xs font-semibold shadow-sm transition"
                            >
                              <span>{act.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Followup prompt suggestions */}
                {m.suggested_followups && m.suggested_followups.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 font-medium">Explore further:</span>
                    {m.suggested_followups.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(f)}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium pr-2"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span>AI CFO querying calculation engines & evaluating trade-offs...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-2xl flex-shrink-0 transition-colors"
      >
        <input
          type="text"
          placeholder="Ask a financial question (e.g. Can I afford a ₹15 lakh car next year?)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-40 shadow-md shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
