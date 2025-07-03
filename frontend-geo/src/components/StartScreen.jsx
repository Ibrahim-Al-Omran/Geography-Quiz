import React, { useState } from 'react';
import styles from './StartScreen.module.css';
import Toggle from './Toggle';

const StartScreen = ({ onStart, regions }) => {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Random");
  const [survival, setSurvival] = useState(false);

  const handleStart = (mode) => {
    onStart(mode, selectedRegion, selectedDifficulty, survival);
  };

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setSelectedRegion(newRegion);

    if (newRegion === "Oceania" && (selectedDifficulty === "Easy" || selectedDifficulty === "Medium")) {
      setSelectedDifficulty("Random");
    }
  };

  const handleToggle = (checked) => {
    setSurvival(checked);
    if (checked) {
      setSelectedRegion("All");
      setSelectedDifficulty("Random");
    }
  };

  return (
    <div className={`${styles.card} ${survival ? styles.compact : ""}`}>
      <h2 className={styles.title}>Geography Quiz</h2>

      <div className={`${styles.selectContainer} ${survival ? styles.hidden : ""}`}>
        <label className={styles.regionLabel}>
          Select Region:
          <select
            value={selectedRegion}
            onChange={handleRegionChange}
            className={styles.regionSelect}
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </label>

        <label className={styles.regionLabel}>
          Select Difficulty:
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className={styles.regionSelect}
          >
            <option value="Random">Random</option>
            {selectedRegion !== "Oceania" && <option value="Easy">Easy</option>}
            {selectedRegion !== "Oceania" && <option value="Medium">Medium</option>}
            {selectedRegion !== "Asia" && <option value="Hard">Hard</option>}
          </select>
        </label>
      </div>

      <div className={styles.buttonStack}>
        <button className={styles.buttonPrimary} onClick={() => handleStart("flag")}>Guess the Flag</button>
        <button className={styles.buttonPrimary} onClick={() => handleStart("capital")}>Guess the Capital</button>
        
        <div>
          <label className={styles.blitzLabel}>Survival Mode</label>
          <Toggle onToggle={handleToggle} />
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
