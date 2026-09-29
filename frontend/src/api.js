const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api`
  : "/api";

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  demoLogin: () => request("/auth/demo-login", { method: "POST" }),
  login: (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getCurrentUser: () => request("/auth/me"),

  // Profile
  getProfile: () => request("/profile"),
  updateProfile: (data) => request("/profile", { method: "PUT", body: JSON.stringify(data) }),

  // Dashboard
  getDashboard: () => request("/dashboard"),

  // Transactions
  getTransactions: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.category && params.category !== "All") searchParams.set("category", params.category);
    if (params.type && params.type !== "All") searchParams.set("type", params.type);
    if (params.search) searchParams.set("search", params.search);
    if (params.start_date) searchParams.set("start_date", params.start_date);
    if (params.end_date) searchParams.set("end_date", params.end_date);
    const qs = searchParams.toString();
    return request(`/transactions${qs ? `?${qs}` : ""}`);
  },
  createTransaction: (data) => request("/transactions", { method: "POST", body: JSON.stringify(data) }),
  updateTransaction: (id, data) => request(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTransaction: (id) => request(`/transactions/${id}`, { method: "DELETE" }),

  // Cashflow
  getCashflow: () => request("/cashflow"),

  // Investments
  getInvestments: () => request("/investments"),
  createInvestment: (data) => request("/investments", { method: "POST", body: JSON.stringify(data) }),
  deleteInvestment: (id) => request(`/investments/${id}`, { method: "DELETE" }),

  // Loans
  getLoans: () => request("/loans"),
  simulateLoan: (data) => request("/loans/simulate", { method: "POST", body: JSON.stringify(data) }),

  // Goals
  getGoals: () => request("/goals"),
  createGoal: (data) => request("/goals", { method: "POST", body: JSON.stringify(data) }),
  updateGoal: (id, data) => request(`/goals/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: "DELETE" }),

  // Health
  getHealth: () => request("/financial-health"),

  // Simulator
  runSimulation: (data) => request("/simulate", { method: "POST", body: JSON.stringify(data) }),
  getScenarios: () => request("/simulate/scenarios"),
  saveScenario: (name, data) => request(`/simulate/save?name=${encodeURIComponent(name)}`, { method: "POST", body: JSON.stringify(data) }),

  // AI CFO
  sendChatMessage: (message) => request("/ai-cfo/chat", { method: "POST", body: JSON.stringify({ message }) }),
  getChatHistory: () => request("/ai-cfo/history"),
  clearChatHistory: () => request("/ai-cfo/history", { method: "DELETE" }),

  // Alerts
  getAlerts: () => request("/alerts"),
  markAlertRead: (id) => request(`/alerts/${id}/read`, { method: "PUT" }),
  dismissAlert: (id) => request(`/alerts/${id}`, { method: "DELETE" }),

  // Demo
  resetDemo: () => request("/demo/reset", { method: "POST" }),
  loadDemo: () => request("/demo/load", { method: "POST" }),
};
