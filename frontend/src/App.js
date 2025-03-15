import React, { useState, useEffect } from 'react';
import Game from './components/Game';
import ScoreTracker from './components/ScoreTracker';
import './index.css';

function App() {
  const [score, setScore] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });

  const handleAnswer = (isCorrect) => {
    setScore(prevScore => ({
      correct: isCorrect ? prevScore.correct + 1 : prevScore.correct,
      incorrect: isCorrect ? prevScore.incorrect : prevScore.incorrect + 1,
      total: prevScore.total + 1
    }));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌍 Globetrotter</h1>
        <p>Guess famous destinations from cryptic clues!</p>
      </header>
      
      <ScoreTracker score={score} />
      <Game onAnswer={handleAnswer} />
    </div>
  );
}

export default App;