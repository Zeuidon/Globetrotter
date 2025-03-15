import React, { useEffect } from 'react';
import ChallengeButton from './ChallengeButton';

function GameResult({ score, username, onPlayAgain }) {
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const saveScore = async () => {
      if (!username) return;
      
      try {
        const response = await fetch('http://localhost:8000/api/save-score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: username,
            score: score.correct 
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save score');
        }
        
        const data = await response.json();
        setResult(data);
      } catch (error) {
        console.error('Error saving score:', error);
      } finally {
        setLoading(false);
      }
    };
    
    saveScore();
  }, [score, username]);

  // Create confetti effect for new high score
  useEffect(() => {
    if (result?.is_new_high_score) {
      const confettiCount = 200;
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
          if (document.body.contains(confetti)) {
            document.body.removeChild(confetti);
          }
        }, 5000);
      }
    }
  }, [result]);

  return (
    <div className="game-container">
      <div className="feedback-container feedback-incorrect">
        <div className="feedback-icon">🏁</div>
        <h3 className="feedback-title">Game Over!</h3>
        
        <div className="score-container" style={{ marginTop: '1rem' }}>
          <div className="score-item">
            <p className="score-label">Final Score</p>
            <p className="score-value correct">{score.correct}</p>
          </div>
        </div>
        
        {loading ? (
          <p>Saving your score...</p>
        ) : result ? (
          <div className="fact-container">
            <h4>Your Best Score: {result.high_score}</h4>
            {result.is_new_high_score && (
              <p className="feedback-text" style={{ color: 'var(--success)', fontWeight: 'bold' }}>
                🎉 New High Score! 🎉
              </p>
            )}
          </div>
        ) : null}
        
        <button className="next-button" onClick={onPlayAgain} style={{ marginTop: '1.5rem' }}>
          Play Again
        </button>
        
        {result && (
          <div style={{ marginTop: '1.5rem' }}>
            <ChallengeButton 
              username={username} 
              highScore={result.high_score} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default GameResult;