import generateOptions from "./generateOptions";

export default function nextQuestion(questionIdx, quiz, mode, survival, setQuestionIdx, setAnswer, setOptions, filteredCountries, setSelectedAnswer, setIsWaitingForNext, setFinished, setTimeLeft) {
    if (questionIdx > 0) {
        const nextIndex = questionIdx - 1;
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
        if (survival) setTimeLeft(3); // reset timer
      } else if(questionIdx === 0) {
        return;
      }
      else {
        setFinished(true);
      }

      setSelectedAnswer(null);
      setIsWaitingForNext(false);
}