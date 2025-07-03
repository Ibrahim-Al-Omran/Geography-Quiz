import React from 'react';
import styles from './OptionsGrid.module.css';

const OptionsGrid = ({ options, onOptionClick, correctAnswer, selectedAnswer, mode}) => {
  if (mode === "capital") {
    return (
      <div className={styles.optionsGrid}>
        {options?.map((option, index) => {
          let className = styles.optionButton;
          if (selectedAnswer) {
            if (option === correctAnswer) className += ` ${styles.correct}`;
            else if (option === selectedAnswer) className += ` ${styles.wrong}`;
          }
          return (
            <button
              id={`option-${index}`}
              key={index}
              className={className}
              onClick={() => onOptionClick(option)}
              disabled={!!selectedAnswer}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  }  
  else if (mode === "flag"){
    return (
      <div className={styles.optionsGrid}>
        {options?.map((option, index) => {
          let className = styles.optionButton;
          if (selectedAnswer) {
            if (option === correctAnswer) className += ` ${styles.correct}`;
            else if (option === selectedAnswer) className += ` ${styles.wrong}`;
          }
          return (
            <button
              id={`option-${index}`}
              key={index}
              className={className}
              onClick={() => onOptionClick(option)}
              disabled={!!selectedAnswer}
            >
              <img 
                src={option} 
                alt={`Flag option ${index + 1}`}
                className={styles.flagOptionImage}
              />
            </button>
          );
        })}
      </div>
    );
  }
  else if (mode === "party") {
    return (
      <div className={styles.PartyOptionsGrid}>
        <button className={styles.PartyOptionButton} onClick={() => onOptionClick("B")}>Previous</button>
        <button className={styles.PartyOptionButton} onClick={() => onOptionClick("A")}>Next</button>
      </div>
    );
  }
};

export default OptionsGrid;