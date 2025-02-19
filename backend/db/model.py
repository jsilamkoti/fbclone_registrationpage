from typing import Optional
from pydantic import EmailStr
from sqlmodel import Field, SQLModel

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