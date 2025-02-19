from sqlmodel import Field, SQLModel, Session, create_engine, select
engine = create_engine("sqlite:///database.db")

# Use SQLite for development
DATABASE_URL = "sqlite:///facebook_registration.db"
engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session