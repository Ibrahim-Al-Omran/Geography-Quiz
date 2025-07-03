import React from 'react';
import styles from './SurvivalRules.module.css';

const SurvivalRulesModal = ({ isOpen, onClose, onStart, mode }) => {
  if (!isOpen) return null;

  const handleStart = () => {
    onStart(mode);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>🏆 Survival Mode Rules</h3>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.modalBody}>
          <div className={styles.rulesList}>
            <div className={styles.rule}>
              <span className={styles.ruleIcon}>⏱️</span>
              <span>You have <strong>3 seconds</strong> per question</span>
            </div>
            
            <div className={styles.rule}>
              <span className={styles.ruleIcon}>❌</span>
              <span>One wrong answer and it's <strong>game over</strong></span>
            </div>
            
            <div className={styles.rule}>
              <span className={styles.ruleIcon}>🔥</span>
              <span>Build the longest <strong>streak</strong> possible</span>
            </div>
            
            <div className={styles.rule}>
              <span className={styles.ruleIcon}>🌍</span>
              <span>Questions from <strong>all regions</strong></span>
            </div>
            
            <div className={styles.rule}>
              <span className={styles.ruleIcon}>🎯</span>
              <span>Random difficulty for maximum challenge</span>
            </div>
          </div>
          
          <div className={styles.challenge}>
            <p>Can you beat the ultimate geography challenge?</p>
          </div>
        </div>
        
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.startButton} onClick={handleStart}>
            Start Survival!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurvivalRulesModal;