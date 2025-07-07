import React, { useState } from 'react';
import { addScore } from '../firebase/leaderboard';
import styles from './ScoreSubmission.module.css';

const ScoreSubmission = ({ streak, mode, onSubmit, onSkip, userId, username }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      console.log('Submitting score:', { userId, username, streak, mode });
      
      const result = await addScore(userId, username, streak, mode);
      
      if (result.success) {
        console.log('Score submitted successfully');
        onSubmit(true);
      } else {
        console.error('Score submission failed:', result.error);
        alert(`Failed to submit score: ${result.error}`);
        onSubmit(false);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      alert('Failed to submit score. Please try again.');
      onSubmit(false);
    } finally {
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