import json
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import random
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.types import TypeDecorator, Text
import os
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = "sqlite:///./globetrotter.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Custom JSON Type using TypeDecorator
class JsonType(TypeDecorator):
    """Enables JSON storage by serializing Python objects to a JSON string."""
    impl = Text

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return json.dumps(value)  # Convert Python object (list/dict) to JSON string

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return json.loads(value)  # Convert JSON string back to Python object

# Define the Destination model with JsonType for JSON fields
class Destination(Base):
    __tablename__ = "destinations"
    
    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, index=True)
    country = Column(String)
    clues = Column(JsonType)      # Automatically handles list/dict conversion
    fun_fact = Column(JsonType)
    trivia = Column(JsonType)

# Define the User Profile model
class UserProfile(Base):
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    invite_code = Column(String, unique=True, index=True)
    high_score = Column(Integer, default=0)

# Create the database tables
Base.metadata.create_all(bind=engine)

# Pydantic models for request/response
class UserProfileCreate(BaseModel):
    username: str

class UserScore(BaseModel):
    username: str
    score: int

# Initialize the database with sample data if empty
def init_db():
    db = SessionLocal()
    # Check if the database is empty
    if db.query(Destination).count() == 0:
        sample_data = [
            {
                "city": "New York City",
                "country": "United States",
                "clues": [
                    "This city is known as 'The Big Apple.'",
                    "It has a famous green statue gifted by France."
                ],
                "fun_fact": [
                    "Times Square was originally called Longacre Square before being renamed in 1904.",
                    "New York City has the largest subway system in the world by number of stations."
                ],
                "trivia": [
                    "Central Park is larger than the country of Monaco.",
                    "The Empire State Building was the tallest building in the world when it was completed in 1931."
                ]
            },
            {
                "city": "Los Angeles",
                "country": "United States",
                "clues": [
                    "This city is known as the 'Entertainment Capital of the World.'",
                    "It has a famous sign on a hill that represents the movie industry."
                ],
                "fun_fact": [
                    "Los Angeles was originally named 'El Pueblo de Nuestra Señora la Reina de los Ángeles de Porciúncula.'",
                    "The Hollywood Walk of Fame has over 2,700 stars honoring celebrities."
                ],
                "trivia": [
                    "L.A. has more cars than people.",
                    "It is home to the only wooden lighthouse in California."
                ]
            },
            {
                "city": "Paris",
                "country": "France",
                "clues": [
                    "This city is known as the 'City of Light.'",
                    "It has a famous iron tower built for a World's Fair."
                ],
                "fun_fact": [
                    "There is only one stop sign in the entire city.",
                    "The Eiffel Tower was originally intended to be a temporary structure."
                ],
                "trivia": [
                    "Paris has 450+ parks and gardens.",
                    "The Louvre was originally built as a fortress in the 12th century."
                ]
            },
            {
                "city": "Tokyo",
                "country": "Japan",
                "clues": [
                    "This city is the most populous metropolitan area in the world.",
                    "It is famous for its cherry blossom season and neon-lit streets."
                ],
                "fun_fact": [
                    "Tokyo was originally known as Edo.",
                    "The city has over 200 top-level domains (TLDs) registered under its name."
                ],
                "trivia": [
                    "Tokyo has more Michelin-starred restaurants than any other city.",
                    "There are over 300 pedestrian crossings in Shibuya alone."
                ]
            },
            {
                "city": "Sydney",
                "country": "Australia",
                "clues": [
                    "This city is famous for its harbor and sail-shaped opera house.",
                    "It hosted the 2000 Summer Olympics."
                ],
                "fun_fact": [
                    "Sydney's Harbour Bridge is nicknamed 'The Coathanger' due to its arch-based design.",
                    "The Sydney Opera House has over one million roof tiles."
                ],
                "trivia": [
                    "Sydney has the deepest natural harbor in the world.",
                    "The city's beaches stretch for more than 70 km along the coast."
                ]
            }
        ]
        
        for item in sample_data:
            destination = Destination(
                city=item["city"],
                country=item["country"],
                clues=item["clues"],
                fun_fact=item["fun_fact"],
                trivia=item["trivia"]
            )
            db.add(destination)
        
        db.commit()
    db.close()

# Initialize the database at startup
@app.on_event("startup")
def startup_event():
    init_db()

# Get a random destination with options
@app.get("/api/random-destination")
def get_random_destination():
    db = SessionLocal()
    destinations = db.query(Destination).all()
    db.close()
    
    if not destinations:
        raise HTTPException(status_code=404, detail="No destinations found")
    
    # Select a random destination
    selected = random.choice(destinations)
    
    # Get 3 other random options for multiple choice
    other_options = random.sample([d for d in destinations if d.id != selected.id], min(3, len(destinations)-1))
    all_options = [selected] + other_options
    random.shuffle(all_options)
    
    # Format the response with clues and options
    selected_clues = random.sample(selected.clues, min(2, len(selected.clues)))
    selected_fun_fact = random.choice(selected.fun_fact)
    selected_trivia = random.choice(selected.trivia)
    
    return {
        "id": selected.id,
        "clues": selected_clues,
        "options": [{"id": opt.id, "city": opt.city, "country": opt.country} for opt in all_options],
        "correct_id": selected.id,
        "fun_fact": selected_fun_fact,
        "trivia": selected_trivia
    }

# Verify an answer
@app.get("/api/check-answer/{destination_id}/{answer_id}")
def check_answer(destination_id: int, answer_id: int):
    return {"correct": destination_id == answer_id}

# Get all destinations (for admin purposes)
@app.get("/api/destinations")
def get_all_destinations():
    db = SessionLocal()
    destinations = db.query(Destination).all()
    db.close()
    
    return [
        {
            "id": d.id,
            "city": d.city,
            "country": d.country,
            "clues": d.clues,
            "fun_fact": d.fun_fact,
            "trivia": d.trivia
        }
        for d in destinations
    ]

# Create a new user profile
@app.post("/api/user-profile")
def create_user_profile(user_profile: UserProfileCreate):
    db = SessionLocal()
    
    # Check if username already exists
    existing_user = db.query(UserProfile).filter(UserProfile.username == user_profile.username).first()
    if existing_user:
        db.close()
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Generate a unique invite code
    invite_code = str(uuid.uuid4())[:8]
    
    # Create new user profile
    new_user = UserProfile(
        username=user_profile.username,
        invite_code=invite_code,
        high_score=0
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()
    
    return {
        "id": new_user.id,
        "username": new_user.username,
        "invite_code": new_user.invite_code,
        "high_score": new_user.high_score
    }

# Get user profile by username
@app.get("/api/user-profile/{username}")
def get_user_profile(username: str):
    db = SessionLocal()
    user = db.query(UserProfile).filter(UserProfile.username == username).first()
    db.close()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "invite_code": user.invite_code,
        "high_score": user.high_score
    }

# Get user profile by invite code
@app.get("/api/user-profile-by-invite/{invite_code}")
def get_user_profile_by_invite(invite_code: str):
    db = SessionLocal()
    user = db.query(UserProfile).filter(UserProfile.invite_code == invite_code).first()
    db.close()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "username": user.username,
        "invite_code": user.invite_code,
        "high_score": user.high_score
    }

# Update user's high score
@app.put("/api/update-score")
def update_user_score(user_score: UserScore):
    db = SessionLocal()
    user = db.query(UserProfile).filter(UserProfile.username == user_score.username).first()
    
    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")
    
    is_new_high_score = False
    if user_score.score > user.high_score:
        is_new_high_score = True
        user.high_score = user_score.score
        db.commit()
    
    db.close()
    
    return {
        "username": user.username,
        "high_score": user.high_score,
        "is_new_high_score": is_new_high_score
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)