import { useEffect, useRef, useState } from "react";
import ChessBoard from "@/components/chess/ChessBoard";
import ChessClock from "@/components/chess/ChessClock";
import ChampionModal from "@/components/ChampionModal";
import {
  analyzePosition,
  cancelStockfishAnalysis,
  type StockfishAnalysis,
} from "@/services/stockfish";

const DEFAULT_TIME = 600; // 10 minutos
const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w";
const SUGGESTION_DEPTH = 10;
const SUGGESTION_TIMEOUT_MS = 60000;
const TIMER_TICK_MS = 250;

type GameOverEvent = {
  type: "gameOver";
  winner: "white" | "black";
  reason: string;
  motivo: "timeout" | "checkmate" | "resignation";
};

type GameState = "setup" | "playing" | "gameOver";

type SuggestionState =
  | {
      status: "idle";
    }
  | {
      status: "loading";
    }
  | {
      status: "ready";
      analysis: StockfishAnalysis;
    }
  | {
      status: "error";
      message: string;
    };

export default function SoloPage() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [fen, setFen] = useState(INITIAL_FEN);
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME);
  const [whiteTime, setWhiteTime] = useState(DEFAULT_TIME);
  const [blackTime, setBlackTime] = useState(DEFAULT_TIME);
  const [gameOverEvent, setGameOverEvent] = useState<GameOverEvent | null>(null);
  const [winner, setWinner] = useState<"white" | "black" | null>(null);
  const [suggestion, setSuggestion] = useState<SuggestionState>({
    status: "idle",
  });

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef(0);
  const suggestionRequestIdRef = useRef(0);
  const timeoutHandledRef = useRef(false);

  const turn = fen.split(" ")[1] === "w" ? "white" : "black";

  function finishByTimeout(color: "white" | "black") {
    if (timeoutHandledRef.current) return;

    const event: GameOverEvent = {
      type: "gameOver",
      winner: color === "white" ? "black" : "white",
      reason:
        color === "white"
          ? "Tempo das Brancas acabou!"
          : "Tempo das Pretas acabou!",
      motivo: "timeout",
    };

    timeoutHandledRef.current = true;
    suggestionRequestIdRef.current += 1;
    cancelStockfishAnalysis("Partida finalizada.");
    setGameState("gameOver");
    setWinner(event.winner);
    setGameOverEvent(event);
    window.dispatchEvent(new CustomEvent("chessGameOver", { detail: event }));
  }

  useEffect(() => {
    if (gameState !== "playing") return;

    lastTickRef.current = Date.now();
    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - lastTickRef.current) / 1000);

      if (elapsedSeconds <= 0) return;

      lastTickRef.current += elapsedSeconds * 1000;

      setWhiteTime((prev) => {
        if (turn === "white") {
          const newTime = Math.max(0, prev - elapsedSeconds);
          if (newTime === 0) {
            finishByTimeout("white");
          }
          return newTime;
        }
        return prev;
      });

      setBlackTime((prev) => {
        if (turn === "black") {
          const newTime = Math.max(0, prev - elapsedSeconds);
          if (newTime === 0) {
            finishByTimeout("black");
          }
          return newTime;
        }
        return prev;
      });
    }, TIMER_TICK_MS);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameState, turn]);

  useEffect(() => {
    return () => {
      suggestionRequestIdRef.current += 1;
      cancelStockfishAnalysis("Analise cancelada.");
    };
  }, []);

  function startGame() {
    suggestionRequestIdRef.current += 1;
    timeoutHandledRef.current = false;
    lastTickRef.current = Date.now();
    setWhiteTime(selectedTime);
    setBlackTime(selectedTime);
    setFen(INITIAL_FEN);
    setGameState("playing");
    setWinner(null);
    setGameOverEvent(null);
    setSuggestion({ status: "idle" });
  }

  function handleMove(newFen: string) {
    if (gameState !== "playing") return;

    suggestionRequestIdRef.current += 1;
    cancelStockfishAnalysis("Sugestao cancelada por novo movimento.");
    setFen(newFen);
    setSuggestion({ status: "idle" });
  }

  async function requestSuggestion() {
    if (gameState !== "playing" || suggestion.status === "loading") return;

    const requestId = suggestionRequestIdRef.current + 1;
    suggestionRequestIdRef.current = requestId;
    setSuggestion({ status: "loading" });

    try {
      const analysis = await analyzePosition(fen, {
        depth: SUGGESTION_DEPTH,
        timeoutMs: SUGGESTION_TIMEOUT_MS,
      });

      if (requestId !== suggestionRequestIdRef.current) return;

      setSuggestion({
        status: "ready",
        analysis,
      });
    } catch (error) {
      if (requestId !== suggestionRequestIdRef.current) return;

      setSuggestion({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel gerar a sugestao.",
      });
    }
  }

  if (gameState === "setup") {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Modo Solo
        </h1>

        <div className="bg-gray-900 p-6 rounded-lg space-y-4">
          <p className="text-gray-300">
            Treine livremente e solicite sugestoes do Stockfish durante a
            partida.
          </p>

          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(Number(e.target.value))}
            className="w-full border border-gray-600 p-3 bg-gray-900 text-white rounded-lg"
          >
            <option value={60}>1 minuto</option>
            <option value={300}>5 minutos</option>
            <option value={600}>10 minutos</option>
            <option value={900}>15 minutos</option>
            <option value={1800}>30 minutos</option>
          </select>

          <button
            onClick={startGame}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 text-white font-semibold rounded-lg transition-colors"
          >
            Comecar Treino
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {winner && gameOverEvent && (
        <ChampionModal
          isOpen={gameState === "gameOver"}
          winner={winner}
          reason={gameOverEvent.reason}
          onPlayAgain={startGame}
          onBackToMenu={() => {
            suggestionRequestIdRef.current += 1;
            timeoutHandledRef.current = false;
            setGameState("setup");
            setWinner(null);
            setGameOverEvent(null);
            setSuggestion({ status: "idle" });
          }}
        />
      )}

      <div className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Modo Solo
        </h1>

        <div className="w-full max-w-sm px-2">
          <ChessClock
            whiteTime={whiteTime}
            blackTime={blackTime}
            turn={turn}
            isRunning={gameState === "playing"}
          />
        </div>

        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl bg-neutral-900 border border-neutral-800 rounded-lg p-4 space-y-3">
          <button
            onClick={requestSuggestion}
            disabled={suggestion.status === "loading" || gameState !== "playing"}
            className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-400 p-3 text-black font-semibold rounded-lg transition-colors"
          >
            {suggestion.status === "loading"
              ? "Analisando..."
              : "Solicitar Sugestao"}
          </button>

          {suggestion.status === "ready" && (
            <div className="grid gap-3 text-sm sm:text-base">
              <div>
                <p className="text-gray-400 font-semibold">Sugestao</p>
                <p className="text-white text-lg">
                  {suggestion.analysis.bestMoveDescription}
                </p>
                <p className="text-gray-500 font-mono">
                  {suggestion.analysis.bestMove}
                </p>
              </div>

              <div>
                <p className="text-gray-400 font-semibold">Avaliacao</p>
                <p className="text-white text-lg">
                  {suggestion.analysis.evaluation.display}
                </p>
                <p className="text-gray-300">
                  {suggestion.analysis.evaluation.label}
                </p>
              </div>
            </div>
          )}

          {suggestion.status === "error" && (
            <p className="text-sm text-red-400">{suggestion.message}</p>
          )}
        </div>

        <div className="w-full flex justify-center px-2">
          <ChessBoard gameFen={fen} playerColor="both" onMove={handleMove} />
        </div>
      </div>
    </>
  );
}
