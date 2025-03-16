# Globetrotter: Interactive Gaming and User Engagement Platform

## 🚀 Overview
Globetrotter is a full-stack web app where users receive cryptic clues about famous places and must guess the destination through interactive challenges. 
The game features a scoring system and leaderboards to enhance engagement. 
It features a dynamic front-end with a robust FastAPI-based backend, ensuring seamless user experiences and efficient data management.
**Documentation:** https://docs.google.com/document/d/1F0Zeb67cA8aR02g9xHsBHzblqLZR42o-55z5lojCs9w/edit?usp=sharing

## 🛠️ Tech Stack
### Frontend
- **React.js** (with hooks and state management)

### Backend
- **FastAPI** (lightweight, high-performance Python framework)
- **SQLAlchemy** (ORM for database interactions)
- **Sqlite** (file-based relational database)

## 📂 Project Structure
Have different folders for backend and frontend.

## 📌 Features
- 🏆 **Gamification**: Earn points, complete challenges, and track progress.
- 📊 **Leaderboard**: Compete with others on the leaderboard.
- 🛡 **User Profiles**: Personalized user score with progress tracking.
- 🔥 **Scalability**: Designed with modular components and API-driven architecture.

## 🧪 Backend Unit Testing
Pytest is used for API testing. Run tests using:
```sh
PYTHONPATH=. pytest tests/
```

## 👨‍💻 To start the project and contribute
1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-branch`)
3. Create and Activate Virtual Environment(`cd ./Globetrotter/backend`, `python3 -m venv .venv`, `source .venv/bin/activate`)
4. For starting backend (`uvicorn app:app --reload`)
5. For frontend (`cd ./Globetrotter/frontend`, `npm i`, `npm start`)
6. Commit changes (`git commit -m "Added new feature"`)
7. Push to branch (`git push origin feature-branch`)
8. Create a PR

## ⚖️ License
MIT License. See [LICENSE](LICENSE) for details.
Author: Ishan Upadhyaya
---

📢 **"Globetrotter - Learn, Play, and Compete!"** 🚀

