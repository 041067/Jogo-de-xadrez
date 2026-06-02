import { useState, useEffect } from "react";

type Props = {
  whiteTime: number; // em segundos
  blackTime: number; // em segundos
  turn: "white" | "black";
  isRunning?: boolean;
  onTimeUp?: (color: "white" | "black") => void;
};

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function isTimeWarning(seconds: number): boolean {
  return seconds <= 60;
}

function isTimeDanger(seconds: number): boolean {
  return seconds <= 10;
}

export default function ChessClock({
  whiteTime,
  blackTime,
  turn,
  isRunning = true,
  onTimeUp,
}: Props) {
  const [displayWhiteTime, setDisplayWhiteTime] = useState(whiteTime);
  const [displayBlackTime, setDisplayBlackTime] = useState(blackTime);

  useEffect(() => {
    setDisplayWhiteTime(whiteTime);
  }, [whiteTime]);

  useEffect(() => {
    setDisplayBlackTime(blackTime);
  }, [blackTime]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (turn === "white") {
        setDisplayWhiteTime((prev) => {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0 && onTimeUp) {
            onTimeUp("white");
          }
          return newTime;
        });
      } else {
        setDisplayBlackTime((prev) => {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0 && onTimeUp) {
            onTimeUp("black");
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [turn, isRunning, onTimeUp]);

  const whiteIsActive = turn === "white";
  const blackIsActive = turn === "black";

  const whiteWarning = isTimeWarning(displayWhiteTime);
  const blackWarning = isTimeWarning(displayBlackTime);
  const whiteDanger = isTimeDanger(displayWhiteTime);
  const blackDanger = isTimeDanger(displayBlackTime);

  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4">
      {/* Brancas */}
      <div
        className={`
          p-3 sm:p-4
          rounded-lg sm:rounded-xl
          text-center
          transition-all duration-300
          ${
            whiteIsActive
              ? "bg-gradient-to-r from-gray-700 to-gray-600 border-2 border-gray-400 shadow-lg"
              : "bg-gray-900 border border-gray-700"
          }
          ${whiteDanger ? "animate-pulse bg-red-900 border-red-600" : ""}
          ${whiteWarning && !whiteDanger ? "border-yellow-600" : ""}
        `}
      >
        <p className="text-xs sm:text-sm text-gray-300 font-semibold mb-1">
          BRANCAS {whiteIsActive ? "(jogando)" : "(aguardando)"}
        </p>
        <p
          className={`
            text-2xl sm:text-3xl md:text-4xl
            font-mono font-bold
            transition-colors duration-300
            ${whiteDanger ? "text-red-400 animate-pulse" : ""}
            ${whiteWarning && !whiteDanger ? "text-yellow-400" : ""}
            ${!whiteWarning ? "text-white" : ""}
          `}
        >
          {formatTime(displayWhiteTime)}
        </p>
      </div>

      {/* Pretas */}
      <div
        className={`
          p-3 sm:p-4
          rounded-lg sm:rounded-xl
          text-center
          transition-all duration-300
          ${
            blackIsActive
              ? "bg-gradient-to-r from-gray-700 to-gray-600 border-2 border-gray-400 shadow-lg"
              : "bg-gray-900 border border-gray-700"
          }
          ${blackDanger ? "animate-pulse bg-red-900 border-red-600" : ""}
          ${blackWarning && !blackDanger ? "border-yellow-600" : ""}
        `}
      >
        <p className="text-xs sm:text-sm text-gray-300 font-semibold mb-1">
          PRETAS {blackIsActive ? "(jogando)" : "(aguardando)"}
        </p>
        <p
          className={`
            text-2xl sm:text-3xl md:text-4xl
            font-mono font-bold
            transition-colors duration-300
            ${blackDanger ? "text-red-400 animate-pulse" : ""}
            ${blackWarning && !blackDanger ? "text-yellow-400" : ""}
            ${!blackWarning ? "text-white" : ""}
          `}
        >
          {formatTime(displayBlackTime)}
        </p>
      </div>
    </div>
  );
}
