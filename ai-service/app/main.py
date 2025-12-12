"""
AI Face Recognition Service
FastAPI application for face encoding and matching
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from app.api import face_routes, health_routes
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup: Create directories
    os.makedirs(settings.FACE_ENCODINGS_PATH, exist_ok=True)
    os.makedirs(settings.TEMP_UPLOAD_PATH, exist_ok=True)
    print(f"🚀 AI Face Recognition Service started on port {settings.PORT}")
    yield
    # Shutdown
    print("👋 AI Face Recognition Service shutting down")


app = FastAPI(
    title="AI Face Recognition Service",
    description="Yüz tanıma ile yoklama takip sistemi",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_routes.router, prefix="/api", tags=["Health"])
app.include_router(face_routes.router, prefix="/api", tags=["Face Recognition"])


@app.get("/")
async def root():
    return {
        "service": "AI Face Recognition Service",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
