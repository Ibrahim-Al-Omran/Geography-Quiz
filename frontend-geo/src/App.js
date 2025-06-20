import React, { useState } from "react";
import './App.css';
import './components/global.css';
import StartScreen from './components/StartScreen';
import QuizContainer from './components/QuizContainer'; // Changed from QuizCard
import ResultScreen from './components/ResultScreen'; // Changed from FinishScreen
import useCountries from './hooks/useCountries';
import shuffle from "./utils/shuffle";
import generateOptions from "./utils/generateOptions";
import Loading from './components/Loading';
import ErrorScreen from './components/ErrorScreen';



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
  const [region, setRegion] = useState(null);
  const allRegions = ["All", ...new Set(countries.map(c => c.region).filter(Boolean))];



  //determine the type of quiz, and pass on all info
  function setupQuiz(selectedMode, selectedRegion) {
    setMode(selectedMode);

    // Filter countries by region if a region is selected
    const filtered = selectedRegion === "All"
      ? countries
      : countries.filter(c => c.region === selectedRegion);

    const shuffled = shuffle(filtered);
    const tenQuestions = shuffled.slice(0, 10);

    const correctAnswer = selectedMode === "capital"
      ? tenQuestions[0]?.capital?.[0] || ""
      : tenQuestions[0]?.flags.png || "";

    setQuiz(tenQuestions);
    setAnswer(correctAnswer);
    setOptions(generateOptions(correctAnswer, countries, selectedMode));
    setQuestionIdx(0);
    setScore(0);
    setStarted(true);
    setFinished(false);
  }



  function handleAnswer(selected) {
    document.activeElement.blur();
    setSelectedAnswer(selected);

    if (selected === answer) {
      setScore((prev) => prev + 1);
      setScoreCelebration(true);
      setTimeout(() => setScoreCelebration(false), 1000); // 1s animation
    }

    setTimeout(() => {
      if (questionIdx < quiz.length - 1) {
        const nextIndex = questionIdx + 1;
        const nextAnswer = mode === "capital" ? 
          quiz[nextIndex]?.capital?.[0] || "" :
          quiz[nextIndex]?.flags.png || "";
        setQuestionIdx(nextIndex);
        setAnswer(nextAnswer);
        setOptions(generateOptions(nextAnswer, countries, mode));
      } else {
        setFinished(true);
      }
      setSelectedAnswer(null);
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
