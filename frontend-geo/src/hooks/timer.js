import { useEffect, useRef } from 'react';

export default function useSurvivalTimer({ timeLeft, setTimeLeft, survival, finished, started, pause, onTimeout }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!survival || finished || !started || pause) return; // Pause prevents ticking

    if (timeLeft <= 0) {
      onTimeout(); // Call when time runs out
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, survival, finished, started, pause, setTimeLeft, onTimeout]);
}

