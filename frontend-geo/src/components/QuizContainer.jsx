import React from 'react';
import styles from './QuizContainer.module.css';
import FlagImage from './FlagImage'; 
import ProgressBar from './ProgressBar';
import OptionsGrid from './OptionsGrid';

function QuizContainer({
  mode, 
  current, 
  questionIdx, 
  quiz, 
  answer, 
  options, 
  score, 
  handleAnswer, 
  selectedAnswer,
  scoreCelebration,
  onBack,
  survival,
  streak,
  timeLeft
}) {
  let questionText = "";
  if (mode === "flag") {
    questionText = "What is the flag of ";
  } else if (mode === "capital") {
    questionText = "What is the capital of ";
  } else if (mode === "party") {
    questionText = "";
  }

  return (
    <div className={`${styles.card} ${styles.quizContainer} ${(mode==="flag") ? styles.flagModeCard : ""}`}>
      {/* Back Button */}
      <button className={styles.backButton} onClick={onBack}>
        ← Back to Menu
      </button>

      {/* Progress Bar */}
      <ProgressBar current={questionIdx} total={quiz.length} />

      {/* Image for capital mode */}
      {!(mode==="flag") && (
        <FlagImage
          src={current.flags.png}
          alt={`Flag of ${current.name.common}`}
        />
      )}

      {/* Question */}
      <h2 className={styles.question}>
        {questionText}
        <span className={styles.questionHighlight}>
          {current.name.common}{(mode === "flag" || mode === "capital") ? "?" : ""}
        </span>
      </h2>

      {/* Options */}
      <OptionsGrid
        options={options}
        onOptionClick={handleAnswer}
        correctAnswer={answer}
        selectedAnswer={selectedAnswer}
        mode={mode}
      />

      {/* Timer (Survival only) */}
      {survival && (
        <div className={styles.timer}>
          ⏱ Time Left: {timeLeft}s
        </div>
      )}

      {/* Score/Streak (party excluded) */}
      {(mode != "party") &&
      <div className={styles.liveScoreContainer}>
        <span className={`${styles.liveScore} ${scoreCelebration ? styles.celebrate : ""}`}>
          {survival
            ? `Current Streak: ${streak}`
            : `Score: ${score}/${questionIdx + 1}`}
        </span>
      </div>}
    </div>
  );
}

export default QuizContainer;
