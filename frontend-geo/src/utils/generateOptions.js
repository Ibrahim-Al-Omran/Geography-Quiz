import shuffle from './shuffle';
export default function generateOptions(correctAnswer, allCountries, mode) {
  
  if (mode === "capital") {
    const validWrongChoices = allCountries
      .filter(c => c.capital && c.capital[0] && c.capital[0] !== correctAnswer)
      .map(c => c.capital[0]);
    const incorrect = shuffle(validWrongChoices).slice(0, 3);
    return shuffle([...incorrect, correctAnswer]);
  } 
  else if (mode === "flag") {
    const validWrongChoices = allCountries
      .filter(c => c.flags && c.flags.png && c.name.common !== correctAnswer)
      .map(c => c.flags.png);
    const incorrect = shuffle(validWrongChoices).slice(0, 3);
    return shuffle([...incorrect, correctAnswer]);
  }

  return [];
}
