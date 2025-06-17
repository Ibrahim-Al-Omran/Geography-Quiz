import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ current, total }) => {
  return (
    <>
      <div className={styles.progressContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${((current + 1) / total) * 100}%` }}
        ></div>
      </div>
      <div className={styles.progressText}>
        Question {current + 1} of {total}
      </div>
    </>
  );
};

export default ProgressBar;