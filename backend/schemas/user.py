from pydantic import BaseModel, EmailStr
from sqlmodel import SQLModel
from datetime import date
from typing import Optional

class UserBase(SQLModel):
    first_name: str
    last_name: str
    email: str
    birth_day: int
    birth_month: int
    birth_year: int
    gender: str

class UserCreate(SQLModel):
    firstName: str
    lastName: str
    email: str
    password: str
    birthDay: int
    birthMonth: int
    birthYear: int
    gender: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str