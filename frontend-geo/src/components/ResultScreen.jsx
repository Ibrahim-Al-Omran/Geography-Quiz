import React from 'react';
import styles from './ResultScreen.module.css';
function giveFeedback(score) {
  if (score === 10) return "Perfect score! You're a geography master!";
  if (score >= 8) return "Great job! You really know your geography!";
  if (score >= 5) return "Good effort! Keep practicing!";
  return "Don't worry, try again and you'll improve!";
}
const ResultScreen = ({ score, onRestart, length }) => {
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Quiz Completed!</h1>
      <p className={styles.scoreText}>
        Your score: <span className={`${styles.scoreValue} ${styles.update}`}>{score}/{length}</span>
      </p>
      <button className={styles.buttonPrimary} onClick={onRestart}>Restart Quiz</button>
      <p className={`${styles.liveScore} ${styles.celebrate}`}>{ giveFeedback(score) }</p>
    </div>
  );
};

export default ResultScreen;