import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import Base, Destination

# Database Connection
DATABASE_URL = "sqlite:///./globetrotter.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)

# Load destinations from JSON file
def load_destinations_from_file(filename):
    try:
        with open(filename, "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: The file {filename} was not found.")
        return []
    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON from {filename}.")
        return []

# Add destinations to the database
def add_destinations_from_file(filename):
    db = SessionLocal()
    new_destinations = load_destinations_from_file(filename)

    for item in new_destinations:
        # Check if the destination already exists in the DB
        existing = db.query(Destination).filter(Destination.city == item["city"]).first()

        if existing:
            print(f"Destination {item['city']} already exists. Skipping.")
            continue

        destination = Destination(
            city=item["city"],
            country=item["country"],
            clues=item["clues"],  # Store directly as a list
            fun_fact=item["fun_fact"],
            trivia=item["trivia"]
        )


        db.add(destination)
        print(f"Added {item['city']}, {item['country']}")

    db.commit()
    db.close()
    print("Process completed!")

if __name__ == "__main__":
    add_destinations_from_file("destinations.json")
