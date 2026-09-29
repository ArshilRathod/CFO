from backend.app.routes.auth import router as auth_router
from backend.app.routes.profile import router as profile_router
from backend.app.routes.dashboard import router as dashboard_router
from backend.app.routes.transactions import router as transactions_router
from backend.app.routes.cashflow import router as cashflow_router
from backend.app.routes.investments import router as investments_router
from backend.app.routes.loans import router as loans_router
from backend.app.routes.goals import router as goals_router
from backend.app.routes.health import router as health_router
from backend.app.routes.simulator import router as simulator_router
from backend.app.routes.ai_cfo import router as ai_cfo_router
from backend.app.routes.alerts import router as alerts_router
from backend.app.routes.demo import router as demo_router

__all__ = [
    "auth_router",
    "profile_router",
    "dashboard_router",
    "transactions_router",
    "cashflow_router",
    "investments_router",
    "loans_router",
    "goals_router",
    "health_router",
    "simulator_router",
    "ai_cfo_router",
    "alerts_router",
    "demo_router",
]
