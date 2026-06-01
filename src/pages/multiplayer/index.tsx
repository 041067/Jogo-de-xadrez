import { useState, useEffect } from "react";
import ChessBoard from "@/components/chess/ChessBoard";
import { socket } from "@/lib/socket";

export default function MultiplayerPage() {
  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [color, setColor] = useState<"white" | "black" | null>(null);
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w",
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    socket.on("roomCreated", ({ roomId, color }) => {
      console.log("Room created:", roomId);

      setCurrentRoom(roomId);
      setColor(color);
      setReady(false);
    });

    socket.on("roomJoined", ({ roomId, color, fen }) => {
      setCurrentRoom(roomId);
      setColor(color);
      setFen(fen);
    });

    socket.on("playersReady", () => {
      setReady(true);
    });

    socket.on("move", (newFen) => {
      setFen(newFen);
    });

    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("playersReady");
      socket.off("move");
    };
  }, []);

  function createRoom() {
    socket.emit("createRoom");
  }

  function joinRoom() {
    socket.emit("joinRoom", roomId);
  }

  function handleMove(newFen: string) {
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

        <button 
          onClick={createRoom} 
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 text-white font-semibold rounded-lg transition-colors"
        >
          Criar Sala
        </button>

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
          <p className="text-3xl font-mono font-bold text-red-600 break-all">{currentRoom}</p>
        </div>

        <p className="text-lg text-gray-300 animate-pulse">
          Aguardando outro jogador entrar...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-center">
        Partida em Andamento
      </h1>

      <div className="bg-gray-900 p-4 rounded-lg space-y-2 w-full max-w-sm text-center">
        <p className="text-gray-400">Sala: <span className="text-white font-mono">{currentRoom}</span></p>
        <p className="text-gray-400">Você é: <span className="text-red-600 font-bold uppercase">{color === 'white' ? 'Brancas' : 'Pretas'}</span></p>
      </div>

      <div className="w-full flex justify-center px-2">
        <ChessBoard gameFen={fen} playerColor={color!} onMove={handleMove} />
      </div>
    </div>
  );
}
