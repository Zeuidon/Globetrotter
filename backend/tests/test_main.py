import pytest
from fastapi.testclient import TestClient
from app import app, SessionLocal, Destination, UserProfile

client = TestClient(app)

def test_get_random_destination():
    response = client.get("/api/random-destination")
    assert response.status_code == 200
    # assert "name" in response.json()
    data = response.json()
    assert "id" in data
    assert "clues" in data
    assert "options" in data
    assert "correct_id" in data
    assert "fun_fact" in data
    assert "trivia" in data
    assert isinstance(data["options"], list)
    assert len(data["options"]) > 0

def test_check_answer_correct():
    response = client.get("/api/check-answer/1/1")
    assert response.status_code == 200
    assert response.json()["correct"] is True

def test_check_answer_incorrect():
    response = client.get("/api/check-answer/1/2")
    assert response.status_code == 200
    assert response.json()["correct"] is False

def test_get_all_destinations():
    response = client.get("/api/destinations")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_create_user_profile():
    new_user = {"username": "testuser123"}
    response = client.post("/api/user-profile", json=new_user)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "username" in data
    assert "invite_code" in data
    assert data["username"] == "testuser123"

def test_create_duplicate_user_profile():
    new_user = {"username": "testuser123"}
    response = client.post("/api/user-profile", json=new_user)
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already taken"

def test_get_user_profile():
    response = client.get("/api/user-profile/testuser123")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser123"
    assert "invite_code" in data
    assert "high_score" in data
