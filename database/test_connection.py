from sqlalchemy import text
from database.session import SessionLocal

def test_connection():

    db = SessionLocal()

    try:
        result = db.execute(text("SELECT 1"))
        print("Database connection successful:")
        print("Result:", result.scalar())
    finally:
        db.close()


if __name__ == "__main__":
    test_connection()
    