import React, { useState } from 'react';
import styles from './StartScreen.module.css';

const StartScreen = ({ onStart, regions }) => {
  const [selectedRegion, setSelectedRegion] = useState("All");

  const handleStart = (mode) => {
    onStart(mode, selectedRegion);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Geography Quiz</h2>
      
      <label className={styles.regionLabel}>
        Select Region:
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className={styles.regionSelect}
        >
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </label>
      
      <div className={styles.buttonStack}>
        <button className={styles.buttonPrimary} onClick={() => handleStart("flag")}>Guess the Flag</button>
        <button className={styles.buttonPrimary} onClick={() => handleStart("capital")}>Guess the Capital</button>
      </div>
    </div>
  );
};

export default StartScreen;