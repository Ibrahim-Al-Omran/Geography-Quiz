import shuffle from './shuffle';

export default function generateOptions(correctAnswer, filteredCountries, mode) {
  
  if (mode === "capital") {
    const validWrongChoices = filteredCountries
      .filter(c => c.capital && c.capital[0] && c.capital[0] !== correctAnswer)
      .map(c => c.capital[0]);
    const incorrect = shuffle(validWrongChoices).slice(0, 3);
    return shuffle([...incorrect, correctAnswer]);
  } 
  else if (mode === "flag") {
    // For flag mode, correctAnswer should be the country name, not the flag URL
    const correctCountry = filteredCountries.find(c => c.name.common === correctAnswer);
    const correctFlagUrl = correctCountry?.flags?.png;
    
    const validWrongChoices = filteredCountries
      .filter(c => c.flags && c.flags.png && c.name.common !== correctAnswer)
      .map(c => c.flags.png);
    const incorrect = shuffle(validWrongChoices).slice(0, 3);
    return shuffle([...incorrect, correctFlagUrl]);
  }

  return [];
}
