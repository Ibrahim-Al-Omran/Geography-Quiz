import React, { useState, useEffect } from 'react';
import { getTopScores } from '../firebase/leaderboard';
import styles from './Leaderboard.module.css';

const Leaderboard = ({ isOpen, onClose, currentMode = 'flag' }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('flag');

  // Set the filter to the current game mode when the modal opens
  useEffect(() => {
    if (isOpen && currentMode) {
      setFilter(currentMode);
    }
  }, [isOpen, currentMode]);

  useEffect(() => {
    if (isOpen) {
      fetchScores();
    }
  }, [isOpen, filter]);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const topScores = await getTopScores(filter, 10);
      setScores(topScores);
    } catch (error) {
      console.error('Error fetching scores:', error);
      setScores([]);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>🏆 Leaderboard</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.filterContainer}>
          <button 
            className={`${styles.filterButton} ${filter === 'flag' ? styles.active : ''}`}
            onClick={() => setFilter('flag')}
          >
            Flags
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'capital' ? styles.active : ''}`}
            onClick={() => setFilter('capital')}
          >
            Capitals
          </button>
        </div>
        
        <div className={styles.modalBody}>
          {loading ? (
            <div className={styles.loading}>Loading scores...</div>
          ) : scores.length === 0 ? (
            <div className={styles.noScores}>No scores yet for {filter} mode. Be the first!</div>
          ) : (
            <div className={styles.scoresList}>
              {scores.map((score, index) => (
                <div key={score.id} className={`${styles.scoreItem} ${index < 3 ? styles.topThree : ''}`}>
                  <div className={styles.rank}>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  <div className={styles.playerInfo}>
                    <div className={styles.playerName}>{score.playerName}</div>
                    <div className={styles.scoreDetails}>
                      {score.mode} mode • {score.date}
                    </div>
                  </div>
                  <div className={styles.streak}>{score.streak}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;