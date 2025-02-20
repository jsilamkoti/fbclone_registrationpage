import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Field, SQLModel, Session, create_engine, select
from backend.schemas.register import register_router
from fastapi.middleware.cors import CORSMiddleware
from backend.db.db import engine, get_session

app = FastAPI(title="Facebook Registration API")
app.include_router(register_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    SQLModel.metadata.create_all(engine)
    uvicorn.run("main:app", host="127.0.0.1", reload=True, port=8000)
