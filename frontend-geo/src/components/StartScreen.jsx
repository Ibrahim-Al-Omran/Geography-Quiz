import React, { useState } from 'react';
import Toggle from './Toggle';
import SurvivalRules from './SurvivalRules';
import styles from './StartScreen.module.css';

const StartScreen = ({ onStart, regions, isAuthenticated, onShowAuth }) => {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Random");
  const [survival, setSurvival] = useState(false);
  const [showSurvivalModal, setShowSurvivalModal] = useState(false);
  const [pendingMode, setPendingMode] = useState(null);

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
  };

  const handleSurvival = (checked) => {
    setSurvival(checked);
    if (checked) {
      setSelectedRegion("All");
      setSelectedDifficulty("Random");
    }
  };

  const handleStart = (mode) => {
    if (survival) {
      setPendingMode(mode);
      setShowSurvivalModal(true);
    } else {
      onStart(mode, selectedRegion, selectedDifficulty, false, mode === "party");
    }
  };

  const handleSurvivalStart = () => {
    setShowSurvivalModal(false);
    onStart(pendingMode, "All", "Random", true, false);
  };

  return (
    <div className={styles.cardWrapper}>
      <div className={`${styles.card} ${survival ? styles.compact : ""}`}>
        <h2 className={styles.title}>Geography Quiz</h2>

        {!isAuthenticated && (
          <div className={styles.guestNotice}>
            <p>🎮 You're playing as a guest</p>
            <p>Sign in to save your scores and compete on leaderboards!</p>
            <button 
              onClick={onShowAuth}
              className={styles.signInButton}
            >
              Sign In / Create Account
            </button>
          </div>
        )}

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
          <button 
            className={styles.buttonPrimary}
            onClick={() => handleStart("flag")} 
          >
            Guess the Flag
          </button>
          <button 
            className={styles.buttonPrimary}
            onClick={() => handleStart("capital")} 
          >
            Guess the Capital
          </button>
          <button 
            className={`${styles.buttonPrimary} ${survival ? styles.partyHidden : ""}`}
            onClick={() => handleStart("party")} 
          >
            Party Mode
          </button>

          <div>
            <label className={styles.blitzLabel}>Survival Mode</label>
            <Toggle onToggle={handleSurvival} />
          </div>
        </div>
      </div>
      
      <SurvivalRules
        isOpen={showSurvivalModal}
        onClose={() => setShowSurvivalModal(false)}
        onStart={handleSurvivalStart}
        mode={pendingMode}
      />
    </div>
  );
};

export default StartScreen;
