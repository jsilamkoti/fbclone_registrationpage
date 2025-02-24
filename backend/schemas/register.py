from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select

from .user import UserCreate
from datetime import date

from ..db.db import engine
from ..db.model import User
from ..utils import hash_password

register_router = APIRouter()


@register_router.post("/api/register")
def register_user(user: UserCreate):
    # Validate age
    try:
        print(user)
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
    print(db_user.first_name)
    with Session(engine) as session:
        try:
            session.add(db_user)
            session.commit()
            session.refresh(db_user)
            return {"message": "User registered successfully", "user_id": db_user.id}

        except Exception as e:
            raise HTTPException(status_code=400,
                                detail=f"Error creating user: {str(e)}"
                                )
