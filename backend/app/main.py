import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import engine, Base, SessionLocal
from backend.app.services.seed_service import seed_demo_data
from backend.app.models.models import User
from backend.app.routes import (
    auth_router,
    profile_router,
    dashboard_router,
    transactions_router,
    cashflow_router,
    investments_router,
    loans_router,
    goals_router,
    health_router,
    simulator_router,
    ai_cfo_router,
    alerts_router,
    demo_router,
)

# Create tables in SQLite
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI CFO API",
    description="Personal Financial Intelligence Engine & Orchestration Backend",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(profile_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(transactions_router, prefix="/api")
app.include_router(cashflow_router, prefix="/api")
app.include_router(investments_router, prefix="/api")
app.include_router(loans_router, prefix="/api")
app.include_router(goals_router, prefix="/api")
app.include_router(health_router, prefix="/api")
app.include_router(simulator_router, prefix="/api")
app.include_router(ai_cfo_router, prefix="/api")
app.include_router(alerts_router, prefix="/api")
app.include_router(demo_router, prefix="/api")

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        # Check if demo user exists, if not seed
        user = db.query(User).filter(User.email == "demo@aicfo.finance").first()
        if not user:
            seed_demo_data(db)
    finally:
        db.close()

@app.get("/api/health")
def api_health():
    return {"status": "healthy", "service": "AI CFO Backend Engine"}

# Optional: Serve built frontend SPA if available (for single-container/unified deployments)
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

dist_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../frontend/dist"))
assets_path = os.path.join(dist_path, "assets")

if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api"):
        return {"detail": "Not Found"}
    if os.path.exists(dist_path):
        candidate = os.path.join(dist_path, full_path)
        if os.path.isfile(candidate):
            return FileResponse(candidate)
        index_file = os.path.join(dist_path, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
    return {"message": "AI CFO API is running. Frontend build not mounted."}

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
