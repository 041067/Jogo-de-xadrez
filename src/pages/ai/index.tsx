import { useEffect, useRef, useState } from "react";
import ChessBoard from "@/components/chess/ChessBoard";
import ChessClock from "@/components/chess/ChessClock";
import ChampionModal from "@/components/ChampionModal";
import {
  AI_DIFFICULTIES,
  analyzePosition,
  applyUciMoveToFen,
  cancelStockfishAnalysis,
  type StockfishAnalysis,
  type StockfishDifficulty,
} from "@/services/stockfish";

const DEFAULT_TIME = 600;
const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w";
const TIMER_TICK_MS = 250;

const AI_TIMEOUT_MS: Record<StockfishDifficulty, number> = {
  beginner: 45000,
  intermediate: 90000,
  advanced: 120000,
};

type PlayerColor = "white" | "black";
type GameState = "setup" | "playing" | "gameOver";

type GameOverEvent = {
  type: "gameOver";
  winner: PlayerColor;
  reason: string;
  motivo: "timeout" | "checkmate" | "resignation";
};

const difficultyOrder: StockfishDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export default function AiPage() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [fen, setFen] = useState(INITIAL_FEN);
  const [difficulty, setDifficulty] =
    useState<StockfishDifficulty>("beginner");
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME);
  const [whiteTime, setWhiteTime] = useState(DEFAULT_TIME);
  const [blackTime, setBlackTime] = useState(DEFAULT_TIME);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiError, setAiError] = useState("");
  const [lastAiAnalysis, setLastAiAnalysis] =
    useState<StockfishAnalysis | null>(null);
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [gameOverEvent, setGameOverEvent] = useState<GameOverEvent | null>(null);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef(0);
  const gameStateRef = useRef(gameState);
  const analysisIdRef = useRef(0);
  const timeoutHandledRef = useRef(false);

  const turn = fen.split(" ")[1] === "w" ? "white" : "black";
  const difficultyConfig = AI_DIFFICULTIES[difficulty];

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  function finishByTimeout(color: PlayerColor) {
    if (timeoutHandledRef.current) return;

    const winnerColor = color === "white" ? "black" : "white";
    const event: GameOverEvent = {
      type: "gameOver",
      winner: winnerColor,
      reason:
        color === "white"
          ? "Tempo das Brancas acabou!"
          : "Tempo das Pretas acabou!",
      motivo: "timeout",
    };

    timeoutHandledRef.current = true;
    analysisIdRef.current += 1;
    cancelStockfishAnalysis("Partida finalizada.");
    setGameState("gameOver");
    setWinner(winnerColor);
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
      analysisIdRef.current += 1;
      cancelStockfishAnalysis("Analise cancelada.");
    };
  }, []);

  function startGame() {
    analysisIdRef.current += 1;
    timeoutHandledRef.current = false;
    lastTickRef.current = Date.now();
    setWhiteTime(selectedTime);
    setBlackTime(selectedTime);
    setFen(INITIAL_FEN);
    setGameState("playing");
    setAiThinking(false);
    setAiError("");
    setLastAiAnalysis(null);
    setWinner(null);
    setGameOverEvent(null);
  }

  function handleMove(newFen: string) {
    if (gameState !== "playing" || aiThinking) return;

    setFen(newFen);
    setAiError("");
    setLastAiAnalysis(null);

    if (newFen.split(" ")[1] === "b") {
      void makeAiMove(newFen);
    }
  }

  async function makeAiMove(currentFen: string) {
    const requestId = analysisIdRef.current + 1;
    analysisIdRef.current = requestId;
    setAiThinking(true);

    try {
      const analysis = await analyzePosition(currentFen, {
        depth: difficultyConfig.depth,
        skillLevel: difficultyConfig.skillLevel,
        timeoutMs: AI_TIMEOUT_MS[difficulty],
      });

      if (
        gameStateRef.current !== "playing" ||
        requestId !== analysisIdRef.current
      ) {
        return;
      }

      setFen(applyUciMoveToFen(currentFen, analysis.bestMove));
      setLastAiAnalysis(analysis);
    } catch (error) {
      if (requestId !== analysisIdRef.current) return;

      setAiError(
        error instanceof Error
          ? error.message
          : "Nao foi possivel obter a jogada da IA.",
      );
    } finally {
      if (requestId === analysisIdRef.current) {
        setAiThinking(false);
      }
    }
  }

  function retryAiMove() {
    if (gameState !== "playing" || aiThinking || turn !== "black") return;

    setAiError("");
    void makeAiMove(fen);
  }

  if (gameState === "setup") {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Jogar contra IA
        </h1>

        <div className="bg-gray-900 p-6 rounded-lg space-y-5">
          <div className="space-y-3">
            <p className="text-gray-300 font-semibold">
              Escolha a dificuldade
            </p>

            <div className="grid gap-2">
              {difficultyOrder.map((level) => {
                const config = AI_DIFFICULTIES[level];
                const selected = difficulty === level;

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`w-full border p-3 text-left font-semibold rounded-lg transition-colors ${
                      selected
                        ? "border-red-500 bg-red-600 text-white"
                        : "border-gray-700 bg-gray-950 text-gray-300 hover:border-red-600"
                    }`}
                  >
                    {config.label}
                    <span className="block text-xs font-normal opacity-80">
                      Depth {config.depth}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Tempo por jogador:
            </label>
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
          </div>

          <button
            onClick={startGame}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 text-white font-semibold rounded-lg transition-colors"
          >
            Comecar Partida
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
            analysisIdRef.current += 1;
            setGameState("setup");
            setWinner(null);
            setGameOverEvent(null);
            setAiThinking(false);
          }}
        />
      )}

      <div className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Jogar contra IA
        </h1>

        <div className="bg-gray-900 border border-neutral-800 p-4 rounded-lg space-y-2 w-full max-w-sm text-center text-sm sm:text-base">
          <p className="text-gray-400">
            IA:{" "}
            <span className="text-red-500 font-bold">
              {difficultyConfig.label}
            </span>
          </p>
          <p className="text-gray-500">Depth {difficultyConfig.depth}</p>

          {aiThinking && (
            <p className="text-yellow-300 font-semibold">IA pensando...</p>
          )}

          {lastAiAnalysis && !aiThinking && (
            <p className="text-gray-300">
              Ultima jogada: {lastAiAnalysis.bestMoveDescription}
            </p>
          )}

          {aiError && <p className="text-red-400">{aiError}</p>}

          {aiError && turn === "black" && !aiThinking && (
            <button
              type="button"
              onClick={retryAiMove}
              className="mt-2 w-full rounded-lg bg-red-600 px-3 py-2 font-semibold text-white transition-colors hover:bg-red-700"
            >
              Tentar novamente
            </button>
          )}
        </div>

        <div className="w-full max-w-sm px-2">
          <ChessClock
            whiteTime={whiteTime}
            blackTime={blackTime}
            turn={turn}
            isRunning={gameState === "playing"}
          />
        </div>

        <div className="w-full flex justify-center px-2">
          <ChessBoard gameFen={fen} playerColor="white" onMove={handleMove} />
        </div>
      </div>
    </>
  );
}
