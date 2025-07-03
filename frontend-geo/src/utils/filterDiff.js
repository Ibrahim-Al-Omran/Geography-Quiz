//##########  === HELPER FOR DIFFICULTY === ###########
  export default function filterDiff(countries, diff) {
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