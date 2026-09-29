# AI CFO — AI-Powered Personal Financial Intelligence System
### Smart India Hackathon (SIH) Prototype / MVP

AI CFO is an interactive personal financial intelligence platform designed to replace black-box financial advice with **verifiable, algorithmic calculations paired with an explainable AI layer**.

The system operates on an architecture where **the AI layer never invents financial numbers**; instead, deterministic backend engines compute cash flow, net worth, debt burdens, emergency runways, and goal gaps, and the AI CFO synthesizes the findings in natural language with structured causal explainability cards.

---

## 🏛️ Architecture

```
USER
  ↓
FRONTEND (React + Vite + Tailwind CSS + Recharts)
  ↓
BACKEND REST API (Python FastAPI)
  ↓
DATABASE (Modular SQLAlchemy + SQLite)
  ↓
FINANCIAL CALCULATION ENGINE (Cash Flow, Net Worth, Loans, Goals, Health)
  ↓
INSIGHT / RISK ENGINE (Spending Spikes, Emergency Runway, DTI)
  ↓
AI CFO ORCHESTRATION LAYER (Intent Detection, Metric Retrieval & Explanation)
  ↓
STRUCTURED FRONTEND RESPONSE (Natural Language + Insight, Why, Data Used, Assumptions, Actions)
```

---

## 🚀 Running Locally

Both the backend and frontend development servers are already running and configured in this workspace.

### 1. Backend (FastAPI on Port 8000)
```bash
cd backend
source venv/bin/activate
PYTHONPATH=. uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation (Swagger UI): **http://127.0.0.1:8000/docs**

### 2. Frontend (React + Vite on Port 5173)
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
Web Application: **http://127.0.0.1:5173**

---

## 🧭 Application Routes

| Route | Page | Purpose |
|---|---|---|
| `/login` | Login Screen | Branding, email sign-in, and instant **"Continue with Demo Account"** button |
| `/onboarding` | 5-Step Onboarding Form | Personal info, financial baselines, milestone selection, risk appetite, and prototype consent |
| `/dashboard` | Executive Dashboard | 7 top metric cards, Net Worth trend (Area Chart), Inflows vs Outflows (Bar Chart), Expense breakdown, Asset allocation |
| `/transactions` | Transaction Ledger | 6-month simulated banking feed with search, category filtering, and Add/Edit/Delete modals |
| `/cashflow` | Cash Flow Engine | Formula equation banner (`Surplus = Inflow - Spend - EMI - SIP`), 6-month historical trends, and savings rate analysis |
| `/investments` | Investment Portfolio | Multi-asset breakdown (Equity, Debt, Gold, Cash), sector allocations, compounding tracker, and holdings management |
| `/loans` | Loans & Debt | Outstanding liabilities, DTI ratio, Axis Bank auto loan, and interactive prepayment optimizer |
| `/goals` | Financial Goals | Milestones (House, Retirement, Car, Emergency), compound interest projections, gap shortfall, and required SIP calculator |
| `/health` | Financial Health | 6 transparent pillars (Cash Flow, Savings, Emergency, Debt, Diversification, Goals) with exact reasons and actions |
| `/simulator` | What-If Simulator | *"What happens if...?"* — 5 real-world presets, interactive sliders, side-by-side Current vs Scenario comparison, and 5-year Net Worth trajectory |
| `/ai-cfo` | AI CFO Chat | Conversational interface with suggested chips, structured analysis cards (Insight, Why, Data Used, Assumptions, Possible Actions) |
| `/alerts` | Risk Alerts | Rule-triggered anomaly alerts (spending spikes, emergency shortage, milestone gap) with mark as read and dismissal |
| `/profile` | User Profile | Stored attributes, financial baselines, active simulated data feed, and prototype consent status |
| `/settings` | System Settings | Notification thresholds, privacy disclosure, and **"Reset Demo Account"** button |

---

## 🎯 20-Step Demo Presentation Walkthrough

Follow this sequence for an end-to-end hackathon demonstration:

1. **Open `http://127.0.0.1:5173/login`** — Observe the modern fintech branding and click **"Continue with Demo Account"**.
2. **Review Dashboard** — Observe the calculated top metrics (Net Worth ₹13.9L, Income ₹1.20L, Expenses ₹58K, Investments ₹14.2L, Loans ₹3.8L, Savings Rate 51.7%, Emergency Fund 5.4 months).
3. **Open Transactions** — Inspect 6 months of historical transactions. Use the search bar to filter by "Salary" or filter by category "Food".
4. **Open Cash Flow** — View the monthly surplus equation box (`₹1,20,000 - ₹58,000 - ₹12,000 - ₹25,000 = ₹25,000`) and the 6-month historical chart.
5. **Open Investments** — Review the multi-asset donut chart (Equity 62.7%, Gold 15.8%, Debt 14.4%, Cash 7.0%) and individual mutual fund holdings.
6. **Open Loans & Debt** — View the Axis Bank auto loan balance (₹3,80,000 @ 9.5%). In the optimizer, change EMI to ₹15,000 to see interest savings calculated instantly.
7. **Open Financial Health** — Review the transparent 6 pillars. Notice how the Emergency Fund pillar gives a clear status (🟡 Needs Attention) and exact reason (covers 5.4 months vs 6 months target).
8. **Open Financial Goals** — View the House Downpayment goal (₹40 Lakhs in 7 years) and note the shortfall warning and required monthly SIP (₹28,000/mo vs current ₹15,000/mo).
9. **Open AI CFO Chat** — Click the suggested question: *"Can I afford a ₹15 lakh car next year?"*.
10. **Analyze AI CFO Response** — Notice the explainability card:
    - **Insight**: Feasible on income, but consumes surplus and leaves emergency fund below safe threshold.
    - **Why**: Explains that ₹25,200/mo EMI consumes 101% of the current ₹25,000 surplus.
    - **Data Used**: Real backend numbers (Income ₹1,20,000, Expenses ₹58,000, Existing EMI ₹12,000, Surplus ₹25,000, Liquid Savings ₹3,50,000).
    - **Assumptions**: 20% down payment, 9.5% auto loan for 5 years.
    - **Actions**: Click the *"Run Car Simulation in What-If Tool"* button.
11. **Interact with What-If Simulator** — Click the preset *"Buy ₹15L Car"*.
12. **Adjust Controls** — Change the Down Payment to ₹4,00,000 or adjust tenure to 7 years.
13. **Compare Outcomes** — See the live Current vs Scenario side-by-side comparison and 5-Year Net Worth Projection chart update.
14. **Save Scenario** — Type "Car Upgrade 2026" and click *"Save Scenario"*.
15. **Open Risk Alerts** — View active notifications (Shopping Anomaly Spike +32%, Emergency Fund Runway). Mark one as read.
16. **Return to Dashboard** — View the unified financial intelligence overview.
17. **Open Settings** — Click *"Reset Demo Account"* to restore the test environment.
