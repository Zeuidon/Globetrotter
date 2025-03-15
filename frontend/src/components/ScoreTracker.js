import React from 'react';

function ScoreTracker({ score }) {
  return (
    <div className="score-container">
      <div className="score-item">
        <p className="score-label">Correct</p>
        <p className="score-value correct">{score.correct}</p>
      </div>
      <div className="score-item">
        <p className="score-label">Incorrect</p>
        <p className="score-value incorrect">{score.incorrect}</p>
      </div>
      <div className="score-item">
        <p className="score-label">Total</p>
        <p className="score-value total">{score.total}</p>
      </div>
    </div>
  );
}

export default ScoreTracker;
