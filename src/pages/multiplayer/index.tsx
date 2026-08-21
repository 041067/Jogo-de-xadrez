import { useEffect, useRef, useState } from "react";
import ChessBoard from "@/components/chess/ChessBoard";
import ChessClock from "@/components/chess/ChessClock";
import ChampionModal from "@/components/ChampionModal";
import ConnectionIndicator, {
  type ConnectionState,
} from "@/components/multiplayer/ConnectionIndicator";
import { socket } from "@/lib/socket";

const DEFAULT_TIME = 600;
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
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    socket.connected ? "connected" : "connecting",
  );
  const lastServerFenRef = useRef(INITIAL_FEN);

  useEffect(() => {
    const markConnected = () => setConnectionState("connected");
    const markConnecting = () => setConnectionState("connecting");
    const markReconnecting = () => setConnectionState("reconnecting");
    const markOffline = () => setConnectionState("offline");

    socket.on("connect", markConnected);
    socket.on("disconnect", markReconnecting);
    socket.on("connect_error", markOffline);
    socket.io.on("reconnect_attempt", markReconnecting);
    socket.io.on("reconnect", markConnected);

    if (socket.connected) markConnected();
    else markConnecting();

    return () => {
      socket.off("connect", markConnected);
      socket.off("disconnect", markReconnecting);
      socket.off("connect_error", markOffline);
      socket.io.off("reconnect_attempt", markReconnecting);
      socket.io.off("reconnect", markConnected);
    };
  }, []);

  useEffect(() => {
    socket.on("roomCreated", ({ roomId, color, whiteTime, blackTime }) => {
      setCurrentRoom(roomId);
      setColor(color);
      lastServerFenRef.current = INITIAL_FEN;
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
      lastServerFenRef.current = fen;
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

    socket.on("move", (newFen: string) => {
      lastServerFenRef.current = newFen;
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

    socket.on(
      "gameOver",
      ({ winner, reason, motivo }: Omit<GameOverEvent, "type">) => {
        const event: GameOverEvent = {
          type: "gameOver",
          winner,
          reason,
          motivo,
        };

        setGameOver(true);
        setGameOverReason(event.reason);
        setWinner(event.winner);
        setGameOverEvent(event);
        window.dispatchEvent(new CustomEvent("chessGameOver", { detail: event }));
      },
    );

    socket.on("opponentDisconnected", () => {
      setGameOver(true);
      setGameOverReason("Seu adversário desconectou!");
      setWinner(null);
      setGameOverEvent(null);
    });

    socket.on("errorMessage", (message: string) => {
      console.error("Erro:", message);
      setFen(lastServerFenRef.current);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("playersReady");
      socket.off("move");
      socket.off("timeSync");
      socket.off("timeUp");
      socket.off("gameOver");
      socket.off("opponentDisconnected");
      socket.off("errorMessage");
    };
  }, []);

  function createRoom() {
    if (!socket.connected) return;
    socket.emit("createRoom", { initialTime: selectedTime });
  }

  function joinRoom() {
    if (!socket.connected || !roomId.trim()) return;
    socket.emit("joinRoom", roomId.trim());
  }

  function handleMove(newFen: string) {
    if (gameOver || !currentRoom || !socket.connected) return;

    setFen(newFen);
    socket.emit("move", {
      roomId: currentRoom,
      fen: newFen,
    });
  }

  if (!currentRoom) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          Jogo Multiplayer
        </h1>

        <ConnectionIndicator state={connectionState} />

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Tempo por jogador:
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white"
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
            disabled={!socket.connected}
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
          >
            Criar Sala
          </button>
        </div>

        <div className="space-y-3">
          <input
            placeholder="Código da sala"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white placeholder-gray-500"
          />

          <button
            onClick={joinRoom}
            disabled={!socket.connected || !roomId.trim()}
            className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
          >
            Entrar em Sala
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6 text-center">
        <h2 className="text-2xl font-bold">Sala Criada</h2>

        <ConnectionIndicator state={connectionState} />

        <div className="space-y-4 rounded-lg bg-gray-900 p-6">
          <p className="text-gray-400">Código da sala:</p>
          <p className="break-all font-mono text-3xl font-bold text-red-600">
            {currentRoom}
          </p>
        </div>

        <p className="animate-pulse text-lg text-gray-300">
          Aguardando outro jogador entrar...
        </p>
      </div>
    );
  }

  const turn = fen.split(" ")[1] === "w" ? "white" : "black";

  if (gameOver && (!winner || !gameOverEvent)) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6 text-center">
        <ConnectionIndicator state={connectionState} />
        <h2 className="text-3xl font-bold text-red-600">Jogo Finalizado</h2>

        <div className="rounded-lg bg-gray-900 p-6">
          <p className="text-xl text-white">{gameOverReason}</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors hover:bg-blue-700"
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
          playerColor={color ?? undefined}
          onPlayAgain={() => window.location.reload()}
          onBackToMenu={() => window.location.reload()}
        />
      )}

      <div className="flex w-full flex-col items-center justify-center gap-4 sm:gap-6">
        <h1 className="text-center text-3xl font-bold sm:text-4xl">
          Partida em Andamento
        </h1>

        <ConnectionIndicator state={connectionState} />

        <div className="w-full max-w-sm space-y-2 rounded-lg bg-gray-900 p-4 text-center text-sm sm:text-base">
          <p className="text-gray-400">
            Sala: <span className="font-mono text-white">{currentRoom}</span>
          </p>
          <p className="text-gray-400">
            Você é: {" "}
            <span className="font-bold uppercase text-red-600">
              {color === "white" ? "Brancas" : "Pretas"}
            </span>
          </p>
        </div>

        <div className="w-full max-w-sm px-2">
          <ChessClock
            whiteTime={whiteTime}
            blackTime={blackTime}
            turn={turn}
            isRunning={!gameOver}
          />
        </div>

        <div className="flex w-full justify-center px-2">
          <ChessBoard
            gameFen={fen}
            playerColor={color!}
            onMove={handleMove}
            disabled={gameOver || !socket.connected}
          />
        </div>
      </div>
    </>
  );
}
