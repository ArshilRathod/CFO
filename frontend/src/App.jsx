import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import CashflowPage from "./pages/CashflowPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import LoansPage from "./pages/LoansPage";
import GoalsPage from "./pages/GoalsPage";
import FinancialHealthPage from "./pages/FinancialHealthPage";
import SimulatorPage from "./pages/SimulatorPage";
import AiCfoPage from "./pages/AiCfoPage";
import AlertsPage from "./pages/AlertsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Onboarding Wizard */}
          <Route path="/onboarding" element={<Layout />}>
            <Route index element={<OnboardingPage />} />
          </Route>

          {/* Core Protected App Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="cashflow" element={<CashflowPage />} />
            <Route path="investments" element={<InvestmentsPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="health" element={<FinancialHealthPage />} />
            <Route path="simulator" element={<SimulatorPage />} />
            <Route path="ai-cfo" element={<AiCfoPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
