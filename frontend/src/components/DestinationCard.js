import React from 'react';

function DestinationCard({ destination }) {
  return (
    <div className="destination-card">
      <h3>{destination.city}, {destination.country}</h3>
      <div className="destination-details">
        <h4>Clues:</h4>
        <ul>
          {destination.clues.map((clue, index) => (
            <li key={index}>{clue}</li>
          ))}
        </ul>
        <h4>Fun Facts:</h4>
        <ul>
          {destination.fun_fact.map((fact, index) => (
            <li key={index}>{fact}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DestinationCard;