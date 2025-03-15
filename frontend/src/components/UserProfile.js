import React, { useState } from 'react';

function UserProfile({ onProfileSubmit, existingUsername }) {
  const [username, setUsername] = useState(existingUsername || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Something went wrong');
      }
      
      const data = await response.json();
      onProfileSubmit(data);
      localStorage.setItem('globetrotter_username', username);
    } catch (error) {
      if (error.message.includes('already taken')) {
        // If username exists, try to fetch the profile
        try {
          const profileResponse = await fetch(`http://localhost:8000/api/user-profile/${username}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            onProfileSubmit(profileData);
            localStorage.setItem('globetrotter_username', username);
            return;
          }
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
        }
      }
      
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="game-container">
      <h2>Enter Your Explorer Name</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name"
            className="option-button"
            style={{ width: '100%', textAlign: 'center' }}
            disabled={isSubmitting}
          />
        </div>
        
        {error && <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>}
        
        <button
          type="submit"
          className="next-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Start Exploring'}
        </button>
      </form>
    </div>
  );
}

export default UserProfile;