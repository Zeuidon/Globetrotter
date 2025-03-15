import React, { useState, useEffect } from 'react';
import AnswerFeedback from './AnswerFeedback';
import DestinationCard from './DestinationCard';

const API_URL = 'http://localhost:8000/api';

function Game({ onAnswer }) {
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchDestination = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setFeedback(null);
    
    try {
      const response = await fetch(`${API_URL}/random-destination`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setGameData(data);
    } catch (error) {
      console.error('Error fetching destination:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestination();
  }, []);

  const handleOptionSelect = async (optionId) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(optionId);
    const isCorrect = optionId === gameData.correct_id;
    
    // Call the onAnswer callback to update the score
    onAnswer(isCorrect);
    
    // Set feedback data
    setFeedback({
      isCorrect,
      funFact: gameData.fun_fact,
      trivia: gameData.trivia
    });
    
    // Create confetti if answer is correct
    if (isCorrect) {
      createConfetti();
    }
  };

  const createConfetti = () => {
    const confettiCount = 100;
    const colors = ['#9d4edd', '#7b2cbf', '#2cb199', '#00b4d8', '#e63946', '#ffbe0b'];
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      
      document.body.appendChild(confetti);
      
      // Remove confetti after animation completes
      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 5000);
    }
  };

  const handleNextDestination = () => {
    fetchDestination();
  };

  if (loading) {
    return (
      <div className="game-container">
        <p className="loading">Loading destination...</p>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="clue-container">
        <h3>Where am I?</h3>
        {gameData.clues.map((clue, index) => (
          <p key={index} className="clue-item">{clue}</p>
        ))}
      </div>
      
      <div className="options-container">
        {gameData.options.map((option) => (
          <button
            key={option.id}
            className="option-button"
            onClick={() => handleOptionSelect(option.id)}
            disabled={selectedAnswer !== null}
          >
            {option.city}
            <span className="country">{option.country}</span>
          </button>
        ))}
      </div>
      
      {feedback && (
        <AnswerFeedback 
          isCorrect={feedback.isCorrect}
          funFact={feedback.funFact}
          trivia={feedback.trivia}
        />
      )}
      
      {selectedAnswer !== null && (
        <button className="next-button" onClick={handleNextDestination}>
          Next Destination
        </button>
      )}
    </div>
  );
}

export default Game;