import os

from sqlmodel import Field, SQLModel, Session, create_engine, select
from dotenv import load_dotenv

load_dotenv()
# Use SQLite for development
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session