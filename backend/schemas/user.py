from pydantic import BaseModel, EmailStr
from sqlmodel import SQLModel
from datetime import date
from typing import Optional

class UserBase(SQLModel):
    first_name: str
    last_name: str
    email: EmailStr
    birth_day: int
    birth_month: int
    birth_year: int
    gender: str

class UserCreate(UserBase):
    password: str

    def validate_age(self) -> bool:
        try:
            birth_date = date(self.birth_year, self.birth_month, self.birth_day)
            today = date.today()
            age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
            return age >= 13
        except ValueError:
            return False

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str