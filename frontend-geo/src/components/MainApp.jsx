import React, { useState, useEffect } from "react";
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../firebase/auth';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import StartScreen from './StartScreen';
import QuizContainer from './QuizContainer'; 
import ResultScreen from './ResultScreen'; 
import AuthModal from './AuthModal';
import useCountries from '../hooks/useCountries';
import shuffle from "../utils/shuffle";
import generateOptions from "../utils/generateOptions";
import Loading from './Loading';
import ErrorScreen from './ErrorScreen';
import useSurvivalTimer from "../hooks/timer";
import filterDiff from "../utils/filterDiff";
import nextQuestion from "../utils/nextQuestion";  
import prevQuestion from "../utils/prevQuestion"; 
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";

function MainApp() {
  const { 
    user, 
    userProfile, 
    setUserProfile,
    isAuthenticated, 
    setUser, 
    setIsAuthenticated, 
    fetchUserProfile, 
    authChecked,  // Add this line to fix the error
    setAuthChecked,
    updateUserWithProfile
  } = useAuth();
  
  // Your existing state variables
  const [quiz, setQuiz] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [options, setOptions] = useState([]);
  const { countries, loading, error } = useCountries();
  const [mode, setMode] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [scoreCelebration, setScoreCelebration] = useState(false);
  const [survival, setSurvival] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [streak, setStreak] = useState(0);  
  const [isWaitingForNext, setIsWaitingForNext] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3);
  const [login, setLogin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // Add or update these state variables
  const [pendingScore, setPendingScore] = useState(null); // Add a state to track the score to save
  const [region, setRegion] = useState("All");
  const [diff, setDiff] = useState("Random");
  const [partyMode, setPartyMode] = useState(false);

  
  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Your existing regions logic
  const allRegions = ["All", ...new Set(countries.map(c => c.region).filter(region => region && region !== "Antarctic"))];

  useSurvivalTimer({
    timeLeft,
    setTimeLeft,
    survival,
    finished,
    started,
    pause: isWaitingForNext || !started || finished, // Pause if waiting, not started, or finished
    onTimeout: () => {
      if (!isWaitingForNext && started && survival) {
        handleAnswer(null); // Handle timeout only if not paused
      }
    }
  });

  // Auth handlers
  const handleLogout = async () => {
    const result = await logoutUser();
    setLogin(false);
    if (result.success) {
      // Reset all states to ensure the app goes back to the start screen
      restartQuiz(true);
    }
  };

  // Add this useEffect to handle the loading state
  useEffect(() => {
    // Only set authLoading to false when we have stable user data
    if (authChecked) {
      // If user is logged in, wait until we have a userProfile
      if (isAuthenticated && user) {
        if (userProfile || !user.displayName) {
          // We have user profile data or there's no displayName to wait for
          setAuthLoading(false);
        }
      } else {
        // Not authenticated, no need to wait
        setAuthLoading(false);
      }
    }
  }, [authChecked, isAuthenticated, user, userProfile]);

  // Replace your existing handleAuthSuccess function with this one
  const handleAuthSuccess = (userData) => {
    console.log('Auth success with user data:', userData);
    
    if (userData) {
      // Force the displayName to be used
      const userWithName = {
        ...userData,
        displayName: userData.displayName || userData.email.split('@')[0]
      };
      
      // Set loading true during the update
      setAuthLoading(true);
      
      // Update the auth context
      updateUserWithProfile(userWithName);
      setUser(userWithName);

      // Save the pending score if there is one
      if (pendingScore) {
        saveScoreToDatabase(userWithName.uid, pendingScore);
        setPendingScore(null); // Clear the pending score
      }
    }
    
    setShowAuthModal(false);
  };

  // Add a function to save the score to the database
  const saveScoreToDatabase = async (userId, score) => {
    try {
      const scoreData = {
        userId,
        score,
        mode: 'survival',
        timestamp: new Date().toISOString()
      };
      await setDoc(doc(db, 'scores', `${userId}-${Date.now()}`), scoreData);
      console.log('Score saved:', scoreData);
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  // Updated quiz setup - no longer requires authentication
  function setupQuiz(selectedMode, selectedRegion, selectedDifficulty, survival, party) {
    setMode(selectedMode);
    setSurvival(survival);
    setRegion(selectedRegion);
    setDiff(selectedDifficulty);
    setPartyMode(party);
    if (survival) {
      setupSurvival(countries, selectedMode);
    }
    else if (party) {
      setupParty(countries, selectedMode, selectedRegion, selectedDifficulty); // Pass selectedMode
    }
    else {
      setupNormal(selectedMode, selectedRegion, selectedDifficulty)
    }
  }

  function setupSurvival(countries, selectedMode) {
    const shuffled = shuffle(countries);
    setFilteredCountries(shuffled);
    const correctAnswer = selectedMode === "capital"
      ? shuffled[0]?.capital?.[0] || ""
      : shuffled[0]?.flags.png || "";

    setQuiz(shuffled);
    setAnswer(correctAnswer);
    setOptions(generateOptions(
      selectedMode === "capital" ? correctAnswer : shuffled[0]?.name?.common || "",
      countries,
      selectedMode
    ));
    setQuestionIdx(0);
    setScore(0);
    setStreak(0);
    setTimeLeft(3); // Reset timer
    setStarted(true);
    setFinished(false);
    setIsWaitingForNext(false); // Reset waiting state
  }

  function setupParty(countries, selectedMode, selectedRegion, selectedDifficulty) {
    let filtered = selectedRegion === "All" ? countries : countries.filter(c => c.region === selectedRegion);    

    if (selectedDifficulty !== "Random") {
      filtered = filterDiff(filtered, selectedDifficulty);
    }
    setFilteredCountries(filtered);
    const shuffled = shuffle(filtered);

    setQuiz(shuffled);
    
    // Set up the first question for party mode
    if (shuffled.length > 0) {
      setAnswer(null); // Party mode doesn't need a specific answer
      setOptions(["A", "B"]); // Party mode uses A/B options
    }
    
    setQuestionIdx(0);
    setScore(0);
    setStarted(true);
    setFinished(false);
  }

  function setupNormal(selectedMode, selectedRegion, selectedDifficulty) {
    let filtered = selectedRegion === "All" ? countries : countries.filter(c => c.region === selectedRegion);
    
    if (selectedDifficulty !== "Random") {
      filtered = filterDiff(filtered, selectedDifficulty);
    }
    
    setFilteredCountries(filtered);
    const shuffled = shuffle(filtered);
    
    const tenQuestions = shuffled.slice(0, 10);
    const correctAnswer = selectedMode === "capital"
      ? tenQuestions[0]?.capital?.[0] || ""
      : tenQuestions[0]?.flags.png || "";

    setQuiz(tenQuestions);
    setAnswer(correctAnswer);
    setOptions(generateOptions(
      selectedMode === "capital" ? correctAnswer : tenQuestions[0]?.name?.common || "",
      filtered,
      selectedMode
    ));
    setQuestionIdx(0);
    setScore(0);
    setStarted(true);
    setFinished(false);
  }

  function handleAnswer(selected) {
    document.activeElement.blur();
    setSelectedAnswer(selected);
    setIsWaitingForNext(true);

    const correct = selected === answer;

    if (correct) {
      setScore((prev) => prev + 1);
      if (survival) setStreak((prev) => prev + 1);
      setScoreCelebration(true);
      setTimeout(() => setScoreCelebration(false), 1000);
    } else if (survival) {
      setTimeout(() => {
        setFinished(true);
        setStreak(0);
        setIsWaitingForNext(false); // Reset waiting state
      }, 1200);
      return;
    }

    setTimeout(() => {
      nextQuestion(
        questionIdx,
        quiz,
        mode,
        survival,
        setQuestionIdx,
        setAnswer,
        setOptions,
        filteredCountries,
        setSelectedAnswer,
        setIsWaitingForNext,
        setFinished,
        setTimeLeft
      );
    }, 1200);
  }

  function restartQuiz(mainMenu) {
    if(mainMenu){
      setQuiz([]);
      setAnswer(null);
      setScore(0);
      setQuestionIdx(0);
      setStarted(false);
      setFinished(false);
      setOptions([]);
      setSelectedAnswer(null);
      setMode(null);
      setScoreCelebration(false);
      setStreak(0);
      setSurvival(false);
      setIsWaitingForNext(false);
      return;
    }
    else {
      setQuiz([]);
      setAnswer(null);
      setScore(0);
      setQuestionIdx(0);
      setStarted(false);
      setFinished(false);
      setOptions([]);
      setSelectedAnswer(null);
      setScoreCelebration(false);
      setStreak(0);
      setIsWaitingForNext(false);
      setTimeLeft(3);
      setupQuiz(mode, region, diff, survival, partyMode);
      return;
    }
    return;
    
  }

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!isAuthenticated || user.uid !== user?.uid) {
          setUser(user);
          setIsAuthenticated(true);
          fetchUserProfile(user.uid);
          console.log('Auth state changed:', { 
            isAuthenticated: true,
            uid: user.uid,
            displayName: user.displayName
          });
        }
      } else {
        if (isAuthenticated) {
          setUser(null);
          setIsAuthenticated(false);
          setUserProfile(null);
          console.log('Auth state changed:', { isAuthenticated: false });
        }
      }
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, [fetchUserProfile, isAuthenticated, user?.uid]);

  // In your render function, show a loading state if authLoading is true
  if (loading || authLoading) {
    return <Loading />;
  }

  return (
    <div className="app-container">

      <div className="card-container">
        {loading && <Loading />}
        {error && <ErrorScreen error={error} />}
        {!started && !loading && !error && (
          <StartScreen 
            onStart={setupQuiz} 
            regions={allRegions}
            isAuthenticated={isAuthenticated}
            onShowAuth={() => setShowAuthModal(true)}
            user={user}
            userProfile={userProfile}
            onLogout={handleLogout}
          />
        )}
        {started && !finished && (
          <QuizContainer
            current={quiz[questionIdx]}
            mode={mode}
            quiz={quiz}
            questionIdx={questionIdx}
            answer={answer}
            options={options}
            handleAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}  
            score={score}
            scoreCelebration={scoreCelebration}
            onBack={restartQuiz}
            streak={streak}
            survival={survival}
            timeLeft={timeLeft}
            username={userProfile?.username || user?.displayName || 'Player'}
          />
        )}
        {finished && (
          <ResultScreen
            score={score}
            total={quiz.length}
            onRestart={restartQuiz} // Direct call to restartQuiz
            
            survival={survival}
            mode={mode}
            userId={user?.uid}
            username={userProfile?.username || user?.displayName || 'Player'}
            isAuthenticated={isAuthenticated}
            onShowAuth={() => setShowAuthModal(true)}
            saveScore={(score) => setPendingScore(score)} // Save score for later
            length={quiz.length} // Ensure this is passed correctly
          />
        )}

      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default MainApp;