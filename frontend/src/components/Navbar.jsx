import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, RefreshCw, Sparkles, Sun, Moon } from "lucide-react";
import { api } from "../api";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ onResetDemo }) {
  const [unreadCount, setUnreadCount] = useState(3);
  const [resetting, setResetting] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();

  const fetchAlerts = async () => {
    try {
      const data = await api.getAlerts();
      const unread = data.filter((a) => !a.is_read).length;
      setUnreadCount(unread);
    } catch (e) {
      // quiet fallback
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleReset = async () => {
    if (!confirm("Reset all financial data to initial demo state?")) return;
    try {
      setResetting(true);
      await api.resetDemo();
      if (onResetDemo) onResetDemo();
      window.location.reload();
    } catch (err) {
      alert("Failed to reset demo: " + err.message);
    } finally {
      setResetting(false);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                AI CFO
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
                DEMO DATA
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">AI-Powered Personal Financial Intelligence</p>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all duration-200 bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-200 dark:border-slate-700/60 shadow-sm"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          {isDark ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span className="hidden sm:inline font-semibold">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline font-semibold">Dark</span>
            </>
          )}
        </button>

        {/* Demo Reset */}
        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:text-slate-300 dark:border-slate-700/60"
          title="Reset back to standard 6-month demo financial profile"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? "animate-spin text-indigo-500" : ""}`} />
          <span className="hidden md:inline">Reset Demo</span>
        </button>

        {/* Alerts Bell */}
        <Link
          to="/alerts"
          className="relative p-2 rounded-lg transition text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/80"
          title="View Financial Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        {/* Demo Financial Profile User Chip */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-lg border transition group bg-slate-100/80 hover:bg-slate-200/80 border-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:border-slate-700/50"
          title="Demo Financial Profile: Aaray Sharma"
        >
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-white transition">
              Aaray Sharma
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Demo Financial Profile • Demo Account</div>
          </div>
          <div className="w-7 h-7 rounded-full bg-indigo-500/15 dark:bg-indigo-600/30 border border-indigo-500/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
            AS
          </div>
        </Link>
      </div>
    </header>
  );
}
