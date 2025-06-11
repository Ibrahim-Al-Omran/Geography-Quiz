import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [quiz, setQuiz] = useState([]);
  const [countries, setCountries] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,capital,flags")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(c => c.capital && c.capital[0] && c.flags?.png);
        setCountries(filtered);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch countries");
        setLoading(false);
      });
  }, []);

  // Shuffle helper
  function shuffle(arr) {
    const array = arr.slice();
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function setupQuiz() {
    const shuffled = shuffle(countries);
    const tenQuestions = shuffled.slice(0, 10);
    const firstCapital = tenQuestions[0]?.capital?.[0] || "";

    setQuiz(tenQuestions);
    setAnswer(firstCapital);
    setOptions(generateOptions(firstCapital, countries));
    setQuestionIdx(0);
    setScore(0);
    setStarted(true);
    setFinished(false);
  }

  function renderQuestion() {
    if (!quiz.length) return null;
    const current = quiz[questionIdx];

    return (
      <div className="card quiz-container">
        {/* Progress Bar */}
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${((questionIdx + 1) / quiz.length) * 100}%` }}
          ></div>
        </div>

        {/* Progress Text */}
        <p className="progress-text">
          Question {questionIdx + 1} of {quiz.length}
        </p>

        {/* Flag Container */}
        <div className="flag-container">
          <img
            src={current.flags.png}
            alt={`Flag of ${current.name.common}`}
            className="flag-image"
          />
        </div>

        {/* Question */}
        <h2 className="question">
          What is the capital of{" "}
          <span className="question-highlight">{current.name.common}</span>?
        </h2>

        {/* Options Grid */}
        <div className="options-container">
          <div className="options-grid">
            {options.map((option, idx) => (
              <button
                id={`option-${idx}`}
                key={idx}
                className="option-button"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}           
          </div>
          <p className="live-score">Current Score: <span className="score-value">{score}</span> / {questionIdx===0? 0 :questionIdx+1} </p>
        </div>

      </div>
    );
  }

  function handleAnswer(selected) {
    // Remove focus from the clicked button to prevent focus ring from persisting
    document.activeElement.blur();
    
    for (let i = 0; i < 4; i++) {
      const optionButton = document.getElementById(`option-${i}`);
      const buttonText = optionButton.textContent;
      if (buttonText === answer) {
        optionButton.classList.add("correct");
      } else {
        optionButton.classList.add("wrong");
      }
    }

    if (selected === answer) {
      setScore((prev) => prev + 1);
      const liveScore = document.querySelector('.live-score');
      const scoreValue = document.querySelector('.score-value');
      
      if (liveScore) {
        liveScore.classList.add('celebrate');
        setTimeout(() => {
          liveScore.classList.remove('celebrate');
        }, 600);
      }
      
      if (scoreValue) {
        scoreValue.classList.add('update');
        setTimeout(() => {
          scoreValue.classList.remove('update');
        }, 600);
      }
    }

    // Move to next question after delay
    setTimeout(() => {
      if (questionIdx < quiz.length - 1) {
        const nextIndex = questionIdx + 1;
        const nextCapital = quiz[nextIndex]?.capital?.[0] || "";

        setQuestionIdx(nextIndex);
        setAnswer(nextCapital);
        setOptions(generateOptions(nextCapital, countries));
      } else {
        setFinished(true);
      }
      for (let i = 0; i < 4; i++) {
      const optionButton = document.getElementById(`option-${i}`);
      optionButton.classList.remove("correct", "wrong");
      }
    }, 1200);
  }

  function generateOptions(correctCapital, allCountries) {
    // Filter countries that have valid capitals and are NOT the correct answer
    const validWrongChoices = allCountries
      .filter(c => c.capital && c.capital[0] && c.capital[0] !== correctCapital)
      .map(c => c.capital[0]);

    // Shuffle and take first 3 incorrect options
    const incorrect = shuffle(validWrongChoices).slice(0, 3);

    return shuffle([...incorrect, correctCapital]);
  }

  return (
    <div className="app-container">
      {loading && (
        <div className="card">
          <div className="status-text loading-text">
            Loading countries...
          </div>
        </div>
      )}
      
      {error && (
        <div className="card">
          <div className="status-text error-text">
            {error}
          </div>
        </div>
      )}
      
      {!started && !loading && !error && (
        <div className="card">
          <h1 className="title">Geography Trivia Quiz</h1>
          <div className="start-container">
            <p className="intro-text">Test your knowledge of world capitals!</p>
            <br></br>
            <button 
              onClick={setupQuiz}
              className="button-primary"
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}
      
      {started && !finished && renderQuestion()}

      {finished && (
        <div className="card">
          <h2 className="title">Quiz Finished!</h2>
          <p className="score-text">
            Your score: <span className="score-value">{score}</span> / {quiz.length}
          </p>
          <button 
            onClick={setupQuiz}
            className="button-primary"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
