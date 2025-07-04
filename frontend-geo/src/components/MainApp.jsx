import React, { useState } from "react";
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../firebase/auth';
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

function MainApp() {
  const { user, userProfile, isAuthenticated } = useAuth();
  
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
    pause: isWaitingForNext,
    onTimeout: () => handleAnswer(null)
  });

  // Auth handlers
  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      restartQuiz();
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Updated quiz setup - no longer requires authentication
  function setupQuiz(selectedMode, selectedRegion, selectedDifficulty, survival, party) {
    setMode(selectedMode);
    setSurvival(survival);
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
    setTimeLeft(3);
    setStarted(true);
    setFinished(false);
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

    if (mode === "party") {
      if (selected === "A") {
        nextQuestion(questionIdx, quiz, mode, survival, setQuestionIdx, setAnswer, setOptions, filteredCountries, setSelectedAnswer, setIsWaitingForNext, setFinished, setTimeLeft);
        return;
      }
      else if (selected === "B") {
        prevQuestion(questionIdx, quiz, mode, survival, setQuestionIdx, setAnswer, setOptions, filteredCountries, setSelectedAnswer, setIsWaitingForNext, setFinished, setTimeLeft);
        return;
      }
    }
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
      }, 1200);
      return;
    }

    setTimeout(() => {
       nextQuestion(questionIdx, quiz, mode, survival, setQuestionIdx, setAnswer, setOptions, filteredCountries, setSelectedAnswer, setIsWaitingForNext, setFinished, setTimeLeft);
    }, 1200);
  }

  function restartQuiz() {
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
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo">Geography Quiz</div>
        <div className="user-info">
          {isAuthenticated ? (
            <>
              <span>Welcome, {userProfile?.username || user?.displayName}!</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)} 
              className="logout-btn"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </header>

      <div className="card-container">
        {loading && <Loading />}
        {error && <ErrorScreen error={error} />}
        {!started && !loading && !error && (
          <StartScreen 
            onStart={setupQuiz} 
            regions={allRegions}
            isAuthenticated={isAuthenticated}
            onShowAuth={() => setShowAuthModal(true)}
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
          />
        )}
        {finished && (
          <ResultScreen
            score={score}
            total={quiz.length}
            onRestart={restartQuiz}
            length={quiz.length}
            survival={survival}
            mode={mode}
            userId={user?.uid}
            username={userProfile?.username || user?.displayName}
            isAuthenticated={isAuthenticated}
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