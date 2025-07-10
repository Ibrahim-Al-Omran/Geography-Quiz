import React, { useState, useEffect } from 'react';
import styles from './Leaderboard.module.css';
import { getLeaderboard } from '../firebase/leaderboard';

const Leaderboard = ({ isOpen, onClose, currentMode = 'flag' }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(currentMode || 'flag');

  // Define fetchScores inside useEffect
  useEffect(() => {
    // Define the function inside the useEffect
    const fetchScores = async () => {
      setLoading(true);
      try {
        const leaderboardData = await getLeaderboard(filter, 100);
        setScores(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Call the function
    fetchScores();
  }, [filter]);

  const handleClose = () => {
    console.log('Closing leaderboard');
    onClose();
  };

  // Handler for overlay clicks
  const handleOverlayClick = (e) => {
    // Only close if the click was directly on the overlay (not its children)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>🏆 Leaderboard</h3>
          <button 
            className={styles.closeButton} 
            onClick={handleClose}
            type="button"
            aria-label="Close leaderboard"
          >
            ✕
          </button>
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
                <div
                  key={score.id}
                  className={
                    `${styles.scoreItem} ` +
                    (index === 0
                      ? styles.first
                      : index === 1
                      ? styles.second
                      : index === 2
                      ? styles.third
                      : '')
                  }
                >
                  <div className={styles.rank}>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </div>
                  <div className={styles.playerInfo}>
                    <div className={styles.playerName}>{score.username}</div>
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