import React from 'react';
import styles from './SurvivalRules.module.css';

const PartyRules = ({ isOpen, onClose, onStart, mode }) => {
  if (!isOpen) return null;

  const handleStart = () => {
    onStart(mode);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>🎮 Party Mode Rules</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.rulesList}>
            <div className={styles.rule}>
              <span className={styles.ruleIcon}>📱</span>
              <span className={styles.ruleText}><strong>Hold the screen away</strong> from you so you can't see it</span>
            </div>
            
            <div className={styles.rule}>
              <span className={styles.ruleIcon}>👥</span>
              <span className={styles.ruleText}><strong>Friends see the screen</strong> and give you clues about the country</span>
            </div>
            
            <div className={styles.rule}>
              <span className={styles.ruleIcon}>🎲</span>
              <span className={styles.ruleText}>Friends can <strong>create their own rules</strong> for giving clues</span>
            </div>
            
            <div className={styles.rule}>
              <span className={styles.ruleIcon}>💡</span>
              <span className={styles.ruleText}>Try clue types: geographical hints, cultural facts, or "hot/cold" guidance</span>
            </div>
            
            <div className={styles.rule}>
              <span className={styles.ruleIcon}>⏱️</span>
              <span className={styles.ruleText}>Set your own time limits or play at your own pace</span>
            </div>
          </div>
          
          <div className={styles.challenge}>
            <p>A fun social twist on geography knowledge!</p>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.startButton} onClick={handleStart}>
            Start Party Mode!
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartyRules;