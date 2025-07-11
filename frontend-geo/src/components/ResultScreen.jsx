import React, { useState, useEffect, useRef } from 'react';
import styles from './ResultScreen.module.css';
import Leaderboard from './Leaderboard';
import { addScore } from '../firebase/leaderboard';

const ResultScreen = ({ score, onRestart, length, survival, mode, userId, username, isAuthenticated, onShowAuth }) => {
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [submittingScore, setSubmittingScore] = useState(false);
  const [scoreWasSaved, setScoreWasSaved] = useState(false);
  const submissionAttempted = useRef(false);

  // Automatically submit score when component mounts - with protection against multiple submissions
  useEffect(() => {
    const submitScore = async () => {
      // Only attempt submission once - this prevents double submissions
      if (submissionAttempted.current) return;
      
      if (isAuthenticated && survival && score > 0 && !scoreSubmitted && !submittingScore) {
        try {
          submissionAttempted.current = true;
          setSubmittingScore(true);
          console.log('Auto-submitting score:', { userId, username, streak: score, mode });
          
          // Check if user is really authenticated
          if (!userId) {
            console.error('Cannot submit score - user ID is missing');
            return;
          }
          
          const result = await addScore(userId, username || 'Anonymous', score, mode);
          
          if (result.success) {
            console.log('Score submission result:', result);
            setScoreSubmitted(true);
            
            // Only set scoreWasSaved to true if a new score was added or an existing score was updated
            if (result.message === 'New score added' || result.message === 'Score updated with higher streak') {
              setScoreWasSaved(true);
            } else {
              // Score wasn't saved because it wasn't higher than existing
              setScoreWasSaved(false);
            }
          } else {
            console.error('Score submission failed:', result.error);
          }
        } catch (error) {
          console.error('Error submitting score:', error);
        } finally {
          setSubmittingScore(false);
        }
      }
    };
    
    submitScore();
    
    // Cleanup function
    return () => {
      submissionAttempted.current = true; // Prevent submission if component unmounts and remounts
    };
  }, [isAuthenticated, survival, score, userId, username, mode]);

  const handleLeaderboardClose = () => {
    setShowLeaderboard(false);
  };

  function handleRestart(mainMenu) {
    onRestart(mainMenu);
  }

  const giveFeedback = (score, length) => {
    if (survival) {
      if (score >= 10) return "Amazing streak! You're a geography master! 🏆";
      if (score >= 5) return `Great streak! You got ${score} correct in a row! 🎯`;
      if (score >= 1) return `Great streak! You got ${score} correct in a row! 🎯`;
      return "Don't worry, try again and you'll improve!";
    } else {
      const percentage = (score / length) * 100;
      if (percentage >= 80) return "Excellent work! You're a geography expert! 🌟";
      if (percentage >= 60) return "Good job! You know your geography well! 👏";
      if (percentage >= 40) return "Not bad! Keep practicing to improve! 📚";
      return "Don't worry, try again and you'll improve!";
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Quiz Completed!</h1>
      
      {!survival && (
        <p className={styles.scoreText}>
          Your score: <span className={`${styles.scoreValue} ${styles.update}`}>{score}/{length}</span>
        </p>
      )}
      
      {survival && (
        <p className={styles.scoreText}>
          Your streak: <span className={`${styles.scoreValue} ${styles.update}`}>{score}</span>
          {isAuthenticated && scoreSubmitted && scoreWasSaved && (
            <span className={styles.scoreSubmitted}>✓ Saved to leaderboard</span>
          )}
        </p>
      )}
      
      {/* Show login/signup prompt if not authenticated */}
      {!isAuthenticated && survival && (
        <div className={styles.authPrompt}>
          <p className={styles.warning}>
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              Your score is not saved!
            </span>
          </p>
          <p>Sign up or log in to save your score:</p>
          <button className={styles.authButton} onClick={onShowAuth}>
            Login / Sign Up
          </button>
        </div>
      )}
      
      <div className={styles.buttonContainer}>
        <button 
          className={styles.buttonPrimary} 
          onClick={() => handleRestart(false)}
        >
          Restart Quiz
        </button>
        <button
          className={styles.buttonPrimary}
          onClick={() => handleRestart(true)}>
            Main Menu
        </button>
        
        {survival && (
          <button 
            className={styles.buttonSecondary} 
            onClick={() => setShowLeaderboard(true)}
            disabled={showLeaderboard}
          >
            {showLeaderboard ? 'Leaderboard Open' : 'View Leaderboard'}
          </button>
        )}
      </div>
      
      <p className={`${styles.liveScore} ${styles.celebrate}`}>
        {giveFeedback(score, length)}
      </p>
      
      <Leaderboard
        isOpen={showLeaderboard}
        onClose={handleLeaderboardClose}
        currentMode={mode} 
      />
    </div>
  );
};

export default ResultScreen;