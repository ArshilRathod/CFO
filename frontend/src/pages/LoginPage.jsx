import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, Sun, Moon } from "lucide-react";
import { api } from "../api";
import { useTheme } from "../context/ThemeContext";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@aicfo.finance");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError("");
      await api.demoLogin();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to log in with demo account");
    } finally {
      setLoading(false);
    }
  };

  const handleFormLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await api.login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-200">
      {/* Theme toggle in corner */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm transition hover:scale-105"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
      </button>

      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[350px] bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[250px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/30 mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            AI CFO
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Your Personal Financial Intelligence
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SIH Prototype MVP</span>
          </div>
        </div>

        <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-md transition-colors">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-500">
              {error}
            </div>
          )}

          {/* Quick Demo Access Button */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full mb-6 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 group transition active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition" />
            <span>Continue with Demo Account</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              Or sign in with email
            </span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
          </div>

          <form onSubmit={handleFormLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 focus:bg-white text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 focus:bg-white text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs border border-slate-300 dark:border-slate-700 transition"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              New user onboarding?{" "}
              <Link to="/onboarding" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
                Start 5-step setup
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          <span>Realistic 6-Month Simulated Indian Financial Dataset Included</span>
        </div>
      </div>
    </div>
  );
}
