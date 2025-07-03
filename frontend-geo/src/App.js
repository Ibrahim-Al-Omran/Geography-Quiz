import React, { useState, useRef, useEffect, use } from "react";
import './App.css';
import './components/global.css';
import StartScreen from './components/StartScreen';
import QuizContainer from './components/QuizContainer'; 
import ResultScreen from './components/ResultScreen'; 
import useCountries from './hooks/useCountries';
import shuffle from "./utils/shuffle";
import generateOptions from "./utils/generateOptions";
import Loading from './components/Loading';
import ErrorScreen from './components/ErrorScreen';
import useSurvivalTimer from "./hooks/timer";



function App() {
  //initialize state variables
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

  //remove antarctic from regions since it only has 2 countries
  const allRegions = ["All", ...new Set(countries.map(c => c.region).filter(region => region && region !== "Antarctic"))];
  const[timeLeft, setTimeLeft] = useState(2); 
  const timerRef = useRef(null);

  useSurvivalTimer({
    timeLeft,
    setTimeLeft,
    survival,
    finished,
    started,
    pause: isWaitingForNext, // <====
    onTimeout: () => handleAnswer(null)
  });




  //##########  === GENERAL SETUP === ###########
  //determine the type of quiz, and pass on all info
  function setupQuiz(selectedMode, selectedRegion, selectedDifficulty, survival) {
    setMode(selectedMode);
    setSurvival(survival);
    if (survival) {
      setupSurvival(countries, selectedMode);
    }
    else {
      setupNormal(selectedMode, selectedRegion, selectedDifficulty)
    }
  }

  //##########  === SURVIVAL SETUP === ###########
  function setupSurvival(countries, selectedMode) {
    const shuffled = shuffle(countries);
    setFilteredCountries(shuffled); //make it easier for generating options later
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
    setTimeLeft(2);
    setStarted(true);
    setFinished(false);
  }


  //##########  === NORMAL SETUP === ###########
  function setupNormal(selectedMode, selectedRegion, selectedDifficulty) {
    // Filter countries by region if a region is selected
    let filtered = selectedRegion === "All" ? countries : countries.filter(c => c.region === selectedRegion);
    
    if (selectedDifficulty !== "Random") {
      filtered = filterDiff(filtered, selectedDifficulty);
    }
    
    setFilteredCountries(filtered); // Store filtered countries in state
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


  //##########  === HELPER FOR DIFFICULTY === ###########
  function filterDiff(countries, diff) {
    return countries.filter(country => {
      const population = country.population || 0;
      
      switch(diff) {
        case "Easy":
          return population > 10000000; // > 10 million
        case "Medium":
          return population >= 1000000 && population <= 10000000; // 1-10 million
        case "Hard":
          return population < 1000000; // < 1 million
        default:
          return true; // Random - include all
      }
    });
  }

  //##########  === ANSWER HANDLER === ###########
  function handleAnswer(selected) {
    document.activeElement.blur();
    setSelectedAnswer(selected);
    setIsWaitingForNext(true); // <<< pause timer

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
      }, 1200); // Give time to show correct answer
      return;
    }

    setTimeout(() => {
      if (questionIdx < quiz.length - 1) {
        const nextIndex = questionIdx + 1;
        const nextQuestion = quiz[nextIndex];
        const nextAnswer = mode === "capital"
          ? nextQuestion?.capital?.[0] || ""
          : nextQuestion?.flags.png || "";

        setQuestionIdx(nextIndex);
        setAnswer(nextAnswer);
        setOptions(generateOptions(
          mode === "capital" ? nextAnswer : nextQuestion?.name?.common || "",
          filteredCountries,
          mode
        ));
        if (survival) setTimeLeft(2); // reset timer
      } else {
        setFinished(true);
      }

      setSelectedAnswer(null);
      setIsWaitingForNext(false); // <<< resume timer
    }, 1200);
  }



  //##########  === RESTART QUIZ === ###########
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
    setStreak(0); // Reset streak when restarting
    setSurvival(false);
  }


  return (
    <div className="app-container">
      <div className="card-container">
        {loading && <Loading />}
        {error && <ErrorScreen error={error} />}
        {!started && !loading && !error && <StartScreen onStart={setupQuiz} regions={allRegions} />}
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
            length = {quiz.length}
          />
        )}
      </div>
    </div>
  );
}

export default App;