import React, { useState } from 'react';
import styles from './StartScreen.module.css';
import Toggle from './Toggle';
import SurvivalRules from './SurvivalRules';
import PartyRules from './PartyRules'; // Import Party Rules component
import Leaderboard from './Leaderboard';

const StartScreen = ({ onStart, regions, isAuthenticated, onShowAuth, user, userProfile, onLogout }) => {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Random");
  const [survival, setSurvival] = useState(false);
  const [showSurvivalModal, setShowSurvivalModal] = useState(false);
  const [showPartyModal, setShowPartyModal] = useState(false); // Add state for party modal
  const [pendingMode, setPendingMode] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleStart = (mode) => {
    if (survival) {
      setPendingMode(mode);
      setShowSurvivalModal(true);
    } else if (mode === "party") {
      // Show party rules when party mode is clicked
      setPendingMode("party");
      setShowPartyModal(true);
    } else {
      onStart(mode, selectedRegion, selectedDifficulty, survival);
    }
  };

  const handleSurvivalStart = (mode) => {
    onStart(mode, selectedRegion, selectedDifficulty, true);
  };

  // New handler for party mode start
  const handlePartyStart = () => {
    // Make sure to pass all the proper parameters and specifically tell the mode NOT to limit countries
    onStart("party", selectedRegion, selectedDifficulty, false, true); 
  };

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    setSelectedRegion(newRegion);

    if (newRegion === "Oceania" && (selectedDifficulty === "Easy" || selectedDifficulty === "Medium")) {
      setSelectedDifficulty("Random");
    }
  };

  const handleSurvival = (checked) => {
    setSurvival(checked);
    if (checked) {
      setSelectedRegion("All");
      setSelectedDifficulty("Random");
    }
  };

  // Calculate display name with priority order
  const displayName = userProfile?.username || user?.displayName || 'Player';
  
  console.log('StartScreen rendering with:', { 
    user: user?.displayName, 
    profile: userProfile?.username,
    final: displayName
  });

  return (
    <div className={styles.startScreenContainer}>
      <div className={`${styles.card} ${survival ? styles.compact : ""}`}>
        <h2 className={styles.title}>PinPoint</h2>
        
        {/* Add login/logout section here */}
        <div className={styles.authSection}>
          {isAuthenticated ? (
            <div className={styles.userWelcome}>
              <p className={styles.welcomeMessage}>
                Welcome, {displayName}!
              </p>
              <button className={styles.logoutButton} onClick={onLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button 
              className={styles.loginButton} 
              onClick={onShowAuth}
            >
              Login / Sign Up
            </button>
          )}
        </div>
        
        {/* View Leaderboard button - styled differently */}
        <div className={styles.leaderboardButtonContainer}>
          <button 
            className={styles.leaderboardButton} 
            onClick={() => setShowLeaderboard(true)}
          >
            View Survival Leaderboard
          </button>
        </div>

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
          <button className={styles.buttonPrimary} onClick={() => handleStart("flag")}>
            Guess the Flag
          </button>
          <button className={styles.buttonPrimary} onClick={() => handleStart("capital")}>
            Guess the Capital
          </button>
          <button className={`${styles.buttonPrimary} ${survival ? styles.partyHidden : ""}`} onClick={() => handleStart("party")}>
            Party Mode
          </button>

          <div>
            <label className={styles.blitzLabel}>Survival Mode</label>
            <Toggle onToggle={handleSurvival} />
          </div>
        </div>
        
        {/* Import Leaderboard and show it when showLeaderboard is true */}
        {showLeaderboard && (
          <Leaderboard 
            isOpen={showLeaderboard}
            onClose={() => setShowLeaderboard(false)}
            currentMode="flag"
          />
        )}
      </div>
      
      <SurvivalRules
        isOpen={showSurvivalModal}
        onClose={() => setShowSurvivalModal(false)}
        onStart={handleSurvivalStart}
        mode={pendingMode}
        isAuthenticated={isAuthenticated} 
      />

      {/* Add Party Rules Modal */}
      <PartyRules
        isOpen={showPartyModal}
        onClose={() => setShowPartyModal(false)}
        onStart={handlePartyStart}
        mode="party"
      />
    </div>
  );
};

export default StartScreen;
