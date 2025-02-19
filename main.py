import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from sqlmodel import Field, SQLModel, Session, create_engine, select
from backend.schemas.register import register_router
import bcrypt
from fastapi.middleware.cors import CORSMiddleware


from backend.db.db import engine, get_session
from backend.db.model import User
from backend.schemas.user import UserCreate, UserResponse


# Database Model
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    first_name: str
    last_name: str
    email: EmailStr = Field(unique=True)
    password_hash: str
    birth_day: int
    birth_month: int
    birth_year: int
    gender: str

# Request Model
class UserCreate(SQLModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    birthDay: int
    birthMonth: int
    birthYear: int
    gender: str

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

app = FastAPI(title="Facebook Registration API")
app.include_router(register_router, tags="register")
origins = [
    "http://localhost:5173"
]

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #["http://localhost:3000"],  # Allow your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

memory_db = {"Facebook": []}
SQLModel.metadata.create_all(engine)

# Create tables
def init_db():
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

@app.post("/api/register")
def register_user(user: UserCreate):
    # Validate age
    try:
        birth_date = date(user.birthYear, user.birthMonth, user.birthDay)
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        if age < 13:
            raise HTTPException(status_code=400, detail="Must be at least 13 years old to register")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid birth date")

    # Create new user
    with Session(engine) as session:
        # Check if email already exists
        existing_user = session.exec(
            select(User).where(User.email == user.email)
        ).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

        # Create new user
        db_user = User(
            first_name=user.firstName,
            last_name=user.lastName,
            email=user.email,
            password_hash=hash_password(user.password),
            birth_day=user.birthDay,
            birth_month=user.birthMonth,
            birth_year=user.birthYear,
            gender=user.gender
        )

        try:
            session.add(db_user)
            session.commit()
            session.refresh(db_user)
            return UserResponse(
            id=db_user.id,
            first_name=db_user.first_name,
            last_name=db_user.last_name,
            email=db_user.email
        )
        except Exception as e:
            raise HTTPException(status_code=400,
            detail=f"Error creating user: {str(e)}"
        )

#if __name__ == "__main__":
    #import uvicorn
    #uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", reload=True, port=8000)