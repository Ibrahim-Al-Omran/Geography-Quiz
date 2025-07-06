import React, { useState } from 'react';
import { addScore } from '../firebase/leaderboard';
import styles from './ScoreSubmission.module.css';

const ScoreSubmission = ({ streak, mode, onSubmit, onSkip, userId, username }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSubmitting(true);
    const success = await addScore(userId, username, streak, mode);
    
    if (success) {
      onSubmit(true);
    } else {
      alert('Failed to submit score. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>🎉 Great streak!</h3>
      <p className={styles.subtitle}>You got {streak} correct in a row!</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <p>Saving score for: <strong>{username}</strong></p>
        
        <div className={styles.buttons}>
          <button 
            type="button" 
            onClick={onSkip}
            className={styles.skipButton}
            disabled={submitting}
          >
            Skip
          </button>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Score'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScoreSubmission;