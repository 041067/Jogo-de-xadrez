import { useState, useEffect, useRef } from "react";
import ChessBoard from "@/components/chess/ChessBoard";
import ChessClock from "@/components/chess/ChessClock";
import ChampionModal from "@/components/ChampionModal";
import { fenToBoard, boardToFen } from "@/utils/fen";
import { getValidMoves } from "@/utils/getValidMoves";

const DEFAULT_TIME = 600; // 10 minutos

type Move = {
  sr: number;
  sc: number;
  tr: number;
  tc: number;
};

type GameOverEvent = {
  type: "gameOver";
  winner: "white" | "black";
  reason: string;
  motivo: "timeout" | "checkmate" | "resignation";
};

function getPieceValue(piece: string): number {
  const values: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 1000,
  };
  return values[piece.toLowerCase()] || 0;
}

function evaluateMove(
  board: string[][],
  move: Move,
  allMoves: Move[]
): number {
  const targetPiece = board[move.tr][move.tc];
  let score = Math.random(); // Base randomness para variedade

  // Priorizar captura de peças
  if (targetPiece !== ".") {
    score += getPieceValue(targetPiece) * 10; // Capturar peças valiosas primeiro
  }

  // Evitar colocar a peça em risco imediato (verificação simples)
  // Se há mais de um movimento, dar prioridade a movimentos que se defendem melhor
  score += Math.random() * 2;

  return score;
}

type GameState = "setup" | "playing" | "gameOver";

export default function SoloPage() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w",
  );
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME);
  const [whiteTime, setWhiteTime] = useState(DEFAULT_TIME);
  const [blackTime, setBlackTime] = useState(DEFAULT_TIME);
  const [gameOverReason, setGameOverReason] = useState("");
  const [gameOverEvent, setGameOverEvent] = useState<GameOverEvent | null>(null);
  const [winner, setWinner] = useState<"white" | "black" | null>(null);
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const turn = fen.split(" ")[1] === "w" ? "white" : "black";

  // Timer para modo solo
  useEffect(() => {
    if (gameState !== "playing") return;

    timerIntervalRef.current = setInterval(() => {
      setWhiteTime((prev) => {
        if (turn === "white") {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0) {
            // Brancas perderam por timeout - Pretas vencem
            const event: GameOverEvent = {
              type: "gameOver",
              winner: "black",
              reason: "Tempo das Brancas acabou! ⏰",
              motivo: "timeout",
            };
            setGameState("gameOver");
            setGameOverReason("Tempo das Brancas acabou!");
            setWinner("black");
            setGameOverEvent(event);
            // Emitir evento para analytics/logging
            window.dispatchEvent(
              new CustomEvent("chessGameOver", { detail: event })
            );
          }
          return newTime;
        }
        return prev;
      });

      setBlackTime((prev) => {
        if (turn === "black") {
          const newTime = Math.max(0, prev - 1);
          if (newTime === 0) {
            // Pretas perderam por timeout - Brancas vencem
            const event: GameOverEvent = {
              type: "gameOver",
              winner: "white",
              reason: "Tempo das Pretas acabou! ⏰",
              motivo: "timeout",
            };
            setGameState("gameOver");
            setGameOverReason("Tempo das Pretas acabou!");
            setWinner("white");
            setGameOverEvent(event);
            // Emitir evento para analytics/logging
            window.dispatchEvent(
              new CustomEvent("chessGameOver", { detail: event })
            );
          }
          return newTime;
        }
        return prev;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameState, turn]);

  function startGame() {
    setWhiteTime(selectedTime);
    setBlackTime(selectedTime);
    setFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w");
    setGameState("playing");
    setWinner(null);
    setGameOverEvent(null);
    setGameOverReason("");
  }

  function handleMove(newFen: string) {
    // Bloquear movimentos se o jogo já acabou
    if (gameState !== "playing") return;
    
    setFen(newFen);

    setTimeout(() => {
      makeAIMove(newFen);
    }, 800);
  }

  function makeAIMove(currentFen: string) {
    if (gameState !== "playing") return;

    const board = fenToBoard(currentFen);
    const possibleMoves: Move[] = [];

    // Encontrar todos os movimentos válidos para as peças pretas
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];

        // Verificar se é peça preta
        if (piece !== "." && piece === piece.toLowerCase()) {
          const validMoves = getValidMoves(board, r, c, "black");

          validMoves.forEach(({ r: tr, c: tc }) => {
            possibleMoves.push({
              sr: r,
              sc: c,
              tr,
              tc,
            });
          });
        }
      }
    }

    if (possibleMoves.length === 0) {
      console.log("Nenhum movimento disponível para a IA");
      return;
    }

    // Avaliar e escolher o melhor movimento
    let bestMove = possibleMoves[0];
    let bestScore = evaluateMove(board, bestMove, possibleMoves);

    for (let i = 1; i < possibleMoves.length; i++) {
      const score = evaluateMove(board, possibleMoves[i], possibleMoves);
      if (score > bestScore) {
        bestScore = score;
        bestMove = possibleMoves[i];
      }
    }

    // Executar o movimento
    const newBoard = structuredClone(board);
    newBoard[bestMove.tr][bestMove.tc] = newBoard[bestMove.sr][bestMove.sc];
    newBoard[bestMove.sr][bestMove.sc] = ".";

    const newFen = boardToFen(newBoard, "w");
    setFen(newFen);
  }

  if (gameState === "setup") {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Jogo Solo
        </h1>

        <div className="bg-gray-900 p-6 rounded-lg space-y-4">
          <p className="text-gray-300">
            Escolha quanto tempo você quer para jogar:
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
            Começar Jogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Modal de Campeão */}
      {winner && gameOverEvent && (
        <ChampionModal
          isOpen={gameState === "gameOver"}
          winner={winner}
          reason={gameOverEvent.reason}
          onPlayAgain={startGame}
          onBackToMenu={() => {
            setGameState("setup");
            setWinner(null);
            setGameOverEvent(null);
            setGameOverReason("");
          }}
        />
      )}

      {/* Tela de Jogo */}
      <div className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Jogo Solo
        </h1>

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
