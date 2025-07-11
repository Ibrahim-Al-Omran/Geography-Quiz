import React, { useState, useEffect } from 'react';
import styles from './Leaderboard.module.css';
import { getLeaderboard } from '../firebase/leaderboard';
import { useAuth } from '../contexts/AuthContext';

const Leaderboard = ({ isOpen, onClose, currentMode = 'flag' }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(currentMode || 'flag');
  const [authReady, setAuthReady] = useState(false);

  // Get auth data
  const { user, userProfile, authChecked } = useAuth();

  // First useEffect - check if auth data is stable
  useEffect(() => {
    if (authChecked) {
      // If authenticated user, make sure we have profile data
      if (user) {
        if (userProfile || !user.displayName) {
          setAuthReady(true);
        }
      } else {
        // Not logged in, we can proceed
        setAuthReady(true);
      }
    }
  }, [authChecked, user, userProfile]);

  // Fetch scores only after auth is ready
  useEffect(() => {
    if (isOpen && authReady) {
      fetchScores(filter);
    }
  }, [isOpen, filter, authReady]);

  // Define fetchScores inside useEffect
  const fetchScores = async (mode) => {
    setLoading(true);
    try {
      const leaderboardData = await getLeaderboard(mode, 100);
      setScores(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

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
          {!authReady || loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <p>Loading scores...</p>
            </div>
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