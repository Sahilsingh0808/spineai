from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import cursor


def create_app() -> FastAPI:
    app = FastAPI(title="Realtime Cursor Backend")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # tighten in prod
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(cursor.router, prefix="/ws")
    return app


app = create_app()