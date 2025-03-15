import React, { useState } from 'react';

function ChallengeButton({ username, highScore }) {
  const [showPopup, setShowPopup] = useState(false);

  const handleChallenge = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?invite=${encodeURIComponent(username)}`;
  };

  const shareToWhatsApp = () => {
    const inviteLink = generateInviteLink();
    const message = `🌍 Challenge: I scored ${highScore} points in Globetrotter! Can you beat me? Play here: ${inviteLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const copyToClipboard = () => {
    const inviteLink = generateInviteLink();
    navigator.clipboard.writeText(inviteLink);
    alert('Invite link copied to clipboard!');
  };

  return (
    <>
      <button className="next-button" onClick={handleChallenge} style={{ backgroundColor: 'var(--secondary)' }}>
        Challenge a Friend
      </button>

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>Challenge a Friend</h3>
            <p>Share your score and challenge friends to beat it!</p>
            
            <div className="challenge-card">
              <div className="challenge-header">
                <h4>🌍 Globetrotter Challenge</h4>
              </div>
              <div className="challenge-body">
                <p><strong>{username}</strong> has scored <strong>{highScore}</strong> points!</p>
                <p>Can you beat this score?</p>
              </div>
            </div>
            
            <div className="share-buttons">
              <button onClick={shareToWhatsApp} className="option-button">
                Share on WhatsApp
              </button>
              <button onClick={copyToClipboard} className="option-button">
                Copy Invite Link
              </button>
            </div>
            
            <button onClick={closePopup} className="close-button">Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChallengeButton;