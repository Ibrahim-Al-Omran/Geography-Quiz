import React from 'react';
import styles from './QuizContainer.module.css';
import FlagImage from './FlagImage'; 
import ProgressBar from './ProgressBar';
import OptionsGrid from './OptionsGrid';

function QuizContainer({mode, 
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
  streak  }) { 
  if (mode === "flag") {
    return (
      <div className={`${styles.card} ${styles.quizContainer} ${mode === "flag" ? styles.flagModeCard : ""}`}>
        {/* Back Button */}
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Menu
        </button>
        
        {/* Progress Bar */}
        <ProgressBar current={questionIdx} total={quiz.length} />

        {/* Question, options, etc. */}
        <h2 className={styles.question}>
          What is the flag of <span className={styles.questionHighlight}>{current.name.common}?</span>
        </h2>
        <OptionsGrid 
          options={options}
          onOptionClick={handleAnswer}
          correctAnswer={answer}
          selectedAnswer={selectedAnswer}
          mode={"flag"}
        />
        {/* Live Score */}
        <div className={styles.liveScoreContainer}>
          <span className={`${styles.liveScore} ${scoreCelebration ? styles.celebrate : ""}`}>
            {survival ? `Current Streak: ${streak}` : `Score: ${score}/${questionIdx + 1}`}
          </span>

        </div>

      </div>
    );
  }  
  else if (mode === "capital") {
    return (
      <div className={`${styles.card} ${styles.quizContainer}`}>
        {/* Back Button */}
        <button className={styles.backButton} onClick={onBack}>
          ← Back to Menu
        </button>
        
        <ProgressBar current={questionIdx} 
                     total={quiz.length} />
        <FlagImage src={current.flags.png} 
                   alt={`Flag of ${current.name.common}`} />
        <h2 className={styles.question}>
          What is the capital of <span className={styles.questionHighlight}>{current.name.common}?</span>
        </h2> 
        <OptionsGrid 
          options={options}
          onOptionClick={handleAnswer}
          correctAnswer={answer}
          selectedAnswer={selectedAnswer}
          mode={"capital"}
        />
        {/* Live Score */}
        <div className={styles.liveScoreContainer}>
          <span className={`${styles.liveScore} ${scoreCelebration ? styles.celebrate : ""}`}>
            {survival ? `Current Streak: ${streak}` : `Score: ${score}/${questionIdx + 1}`}
          </span>
        </div>

      </div>
    );
  }
}

export default QuizContainer;