import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setLeaders(data);
        } else {
          console.error('Failed to fetch leaderboard');
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  return (
    <div className="leaderboard-container">
      <h3>Top Explorers</h3>
      
      {leaders.length > 0 ? (
        <div className="leaderboard-list">
          {leaders.map((leader, index) => (
            <div key={index} className="leaderboard-item">
              <span className="leaderboard-rank">{index + 1}</span>
              <span className="leaderboard-name">{leader.username}</span>
              <span className="leaderboard-score">{leader.high_score}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No explorers found yet. Be the first!</p>
      )}
    </div>
  );
}

export default Leaderboard;