import { useState, useCallback, useRef } from "react";

type TimerState = {
  whiteTime: number;
  blackTime: number;
  lastMoveTime: number; // timestamp do último movimento
};

export function useChessTimer(
  initialTime: number = 600, // 10 minutos por padrão
) {
  const [timerState, setTimerState] = useState<TimerState>({
    whiteTime: initialTime,
    blackTime: initialTime,
    lastMoveTime: Date.now(),
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(
    (turn: "white" | "black") => {
      // Limpa intervalo anterior se existir
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        setTimerState((prev) => {
          const newState = { ...prev };

          if (turn === "white") {
            newState.blackTime = Math.max(0, prev.blackTime - 1);
            if (newState.blackTime === 0) {
              clearInterval(intervalRef.current!);
              return newState;
            }
          } else {
            newState.whiteTime = Math.max(0, prev.whiteTime - 1);
            if (newState.whiteTime === 0) {
              clearInterval(intervalRef.current!);
              return newState;
            }
          }

          return newState;
        });
      }, 1000);
    },
    [],
  );

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback((initialTime: number) => {
    stopTimer();
    setTimerState({
      whiteTime: initialTime,
      blackTime: initialTime,
      lastMoveTime: Date.now(),
    });
  }, [stopTimer]);

  const syncTimer = useCallback((whiteTime: number, blackTime: number) => {
    setTimerState((prev) => ({
      ...prev,
      whiteTime,
      blackTime,
      lastMoveTime: Date.now(),
    }));
  }, []);

  const onMoveMade = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      lastMoveTime: Date.now(),
    }));
  }, []);

  return {
    ...timerState,
    startTimer,
    stopTimer,
    resetTimer,
    syncTimer,
    onMoveMade,
  };
}
