import { useState, useEffect } from "react";
import ChessBoard from "@/components/chess/ChessBoard";
import ChessClock from "@/components/chess/ChessClock";
import ChampionModal from "@/components/ChampionModal";
import { socket } from "@/lib/socket";

const DEFAULT_TIME = 600; // 10 minutos
const INITIAL_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w";

type PlayerColor = "white" | "black";

type GameOverEvent = {
  type: "gameOver";
  winner: PlayerColor;
  reason: string;
  motivo: "timeout" | "checkmate" | "resignation";
};

function getOpponentColor(color: PlayerColor): PlayerColor {
  return color === "white" ? "black" : "white";
}

function getTimeoutReason(color: PlayerColor): string {
  return color === "white"
    ? "Tempo das Brancas acabou!"
    : "Tempo das Pretas acabou!";
}

export default function MultiplayerPage() {
  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [color, setColor] = useState<PlayerColor | null>(null);
  const [fen, setFen] = useState(INITIAL_FEN);
  const [whiteTime, setWhiteTime] = useState(DEFAULT_TIME);
  const [blackTime, setBlackTime] = useState(DEFAULT_TIME);
  const [ready, setReady] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState("");
  const [gameOverEvent, setGameOverEvent] = useState<GameOverEvent | null>(null);
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [selectedTime, setSelectedTime] = useState(DEFAULT_TIME);

  useEffect(() => {
    socket.on("roomCreated", ({ roomId, color, whiteTime, blackTime }) => {
      console.log("Room created:", roomId);

      setCurrentRoom(roomId);
      setColor(color);
      setFen(INITIAL_FEN);
      setWhiteTime(whiteTime);
      setBlackTime(blackTime);
      setReady(false);
      setGameOver(false);
      setGameOverReason("");
      setGameOverEvent(null);
      setWinner(null);
    });

    socket.on("roomJoined", ({ roomId, color, fen, whiteTime, blackTime }) => {
      setCurrentRoom(roomId);
      setColor(color);
      setFen(fen);
      setWhiteTime(whiteTime);
      setBlackTime(blackTime);
      setGameOver(false);
      setGameOverReason("");
      setGameOverEvent(null);
      setWinner(null);
    });

    socket.on("playersReady", ({ whiteTime, blackTime }) => {
      setReady(true);
      setWhiteTime(whiteTime);
      setBlackTime(blackTime);
    });

    socket.on("move", (newFen) => {
      setFen(newFen);
    });

    socket.on("timeSync", ({ whiteTime, blackTime }) => {
      setWhiteTime(whiteTime);
      setBlackTime(blackTime);
    });

    socket.on("timeUp", ({ color }: { color: PlayerColor }) => {
      const event: GameOverEvent = {
        type: "gameOver",
        winner: getOpponentColor(color),
        reason: getTimeoutReason(color),
        motivo: "timeout",
      };

      setGameOver(true);
      setGameOverReason(event.reason);
      setWinner(event.winner);
      setGameOverEvent(event);
      window.dispatchEvent(new CustomEvent("chessGameOver", { detail: event }));
    });

    socket.on("opponentDisconnected", () => {
      setGameOver(true);
      setGameOverReason("Seu adversário desconectou!");
      setWinner(null);
      setGameOverEvent(null);
    });

    socket.on("errorMessage", (message) => {
      console.error("Erro:", message);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("playersReady");
      socket.off("move");
      socket.off("timeSync");
      socket.off("timeUp");
      socket.off("opponentDisconnected");
      socket.off("errorMessage");
    };
  }, []);

  function createRoom() {
    socket.emit("createRoom", { initialTime: selectedTime });
  }

  function joinRoom() {
    socket.emit("joinRoom", roomId);
  }

  function handleMove(newFen: string) {
    if (gameOver) return;

    setFen(newFen);

    if (currentRoom) {
      socket.emit("move", {
        roomId: currentRoom,
        fen: newFen,
      });
    }
  }

  if (!currentRoom) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Jogo Multiplayer
        </h1>

        <div className="space-y-4">
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
            onClick={createRoom} 
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 text-white font-semibold rounded-lg transition-colors"
          >
            Criar Sala
          </button>
        </div>

        <div className="space-y-3">
          <input
            placeholder="Código da sala"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full border border-gray-600 p-3 bg-gray-900 text-white rounded-lg placeholder-gray-500"
          />

          <button
            onClick={joinRoom}
            className="w-full bg-green-600 hover:bg-green-700 p-3 text-white font-semibold rounded-lg transition-colors"
          >
            Entrar em Sala
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        <h2 className="text-2xl font-bold">Sala Criada</h2>

        <div className="bg-gray-900 p-6 rounded-lg space-y-4">
          <p className="text-gray-400">Código da sala:</p>
          <p className="text-3xl font-mono font-bold text-red-600 break-all">
            {currentRoom}
          </p>
        </div>

        <p className="text-lg text-gray-300 animate-pulse">
          Aguardando outro jogador entrar...
        </p>
      </div>
    );
  }

  const turn = fen.split(" ")[1] === "w" ? "white" : "black";

  if (gameOver && (!winner || !gameOverEvent)) {
    return (
      <div className="w-full max-w-md mx-auto space-y-6 text-center">
        <h2 className="text-3xl font-bold text-red-600">Jogo Finalizado</h2>

        <div className="bg-gray-900 p-6 rounded-lg">
          <p className="text-xl text-white">{gameOverReason}</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 text-white font-semibold rounded-lg transition-colors"
        >
          Voltar ao Menu
        </button>
      </div>
    );
  }

  return (
    <>
      {winner && gameOverEvent && (
        <ChampionModal
          isOpen={gameOver}
          winner={winner}
          reason={gameOverEvent.reason}
          onPlayAgain={() => window.location.reload()}
          onBackToMenu={() => window.location.reload()}
        />
      )}

      <div className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center">
          Partida em Andamento
        </h1>

        <div className="bg-gray-900 p-4 rounded-lg space-y-2 w-full max-w-sm text-center text-sm sm:text-base">
          <p className="text-gray-400">Sala: <span className="text-white font-mono">{currentRoom}</span></p>
          <p className="text-gray-400">Você é: <span className="text-red-600 font-bold uppercase">{color === 'white' ? 'Brancas' : 'Pretas'}</span></p>
        </div>

        <div className="w-full max-w-sm px-2">
          <ChessClock
            whiteTime={whiteTime}
            blackTime={blackTime}
            turn={turn}
            isRunning={!gameOver}
          />
        </div>

        <div className="w-full flex justify-center px-2">
          <ChessBoard gameFen={fen} playerColor={color!} onMove={handleMove} />
        </div>
      </div>
    </>
  );
}
