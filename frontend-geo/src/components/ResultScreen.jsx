import React, { useState } from 'react';
import ScoreSubmission from './ScoreSubmission';
import Leaderboard from './Leaderboard';
import styles from './ResultScreen.module.css';


function giveFeedback(score, length) {
  if (score === length) return "Perfect score! You're a geography master!";
  if (score >= Math.floor(2 * (length / 3))) return "Great job! You really know your geography!";
  if (score >= Math.floor(length / 3)) return "Good effort! Keep practicing!";
  return "Don't worry, try again and you'll improve!";
}

const ResultScreen = ({ score, onRestart, length, survival, mode, userId, username }) => {
  const [showScoreSubmission, setShowScoreSubmission] = useState(survival && score > 0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const handleScoreSubmit = (success) => {
    setShowScoreSubmission(false);
    setScoreSubmitted(success);
    if (success) {
      setShowLeaderboard(true);
    }
  };

  const handleSkip = () => {
    setShowScoreSubmission(false);
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
        </p>
      )}
      
      <div className={styles.buttonContainer}>
        <button className={styles.buttonPrimary} onClick={onRestart}>
          Restart Quiz
        </button>
        
        {survival && <button 
          className={styles.buttonPrimary} 
          onClick={() => setShowLeaderboard(true)}
        >
          View Leaderboard
        </button>}
      </div>
      
      <p className={`${styles.liveScore} ${styles.celebrate}`}>
        {giveFeedback(score, length)}
      </p>
      
      <Leaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        currentMode={mode} 
      />
      
      {showScoreSubmission && (
        <ScoreSubmission
          streak={score}
          mode={mode}
          onSubmit={handleScoreSubmit}
          onSkip={handleSkip}
          userId={userId}
          username={username}
        />
      )}
    </div>
  );
};

export default ResultScreen;