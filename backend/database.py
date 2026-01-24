# backend/database.py
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# SQLite database (simplest - just a file)
DATABASE_URL = "sqlite:///./idp_platform.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Document model - represents a processed document
class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    
    # Extracted fields
    invoice_number = Column(String, nullable=True)
    date = Column(String, nullable=True)
    total = Column(String, nullable=True)
    vendor_name = Column(String, nullable=True)
    
    # Raw data
    raw_text = Column(Text, nullable=True)
    
    # Processing info
    processing_time = Column(Float, nullable=True)  # in seconds
    status = Column(String, default="success")  # success/failed

# Create tables
Base.metadata.create_all(bind=engine)

# Helper function to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()