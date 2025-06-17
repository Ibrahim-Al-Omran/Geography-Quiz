import React from 'react';
import styles from './ResultScreen.module.css';

const ResultScreen = ({ score, onRestart, length }) => {
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Quiz Completed!</h1>
      <p className={styles.scoreText}>
        Your score: <span className={`${styles.scoreValue} ${styles.update}`}>{score}/{length}</span>
      </p>
      <button className={styles.buttonPrimary} onClick={onRestart}>Restart Quiz</button>
      <p className={`${styles.liveScore} ${styles.celebrate}`}>🎉 Great job! 🎉</p>
    </div>
  );
};

export default ResultScreen;