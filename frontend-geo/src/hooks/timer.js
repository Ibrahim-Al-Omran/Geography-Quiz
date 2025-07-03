import { useEffect, useRef } from 'react';

export default function useSurvivalTimer({ timeLeft, setTimeLeft, survival, finished, started, onTimeout }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!survival || finished || !started) return;

    if (timeLeft <= 0) {
      onTimeout(); // Call when time runs out (e.g., handleAnswer(null))
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, survival, finished, started, setTimeLeft, onTimeout]);
}
