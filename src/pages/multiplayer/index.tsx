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
      <div className="space-y-4">
        <button onClick={createRoom} className="bg-blue-600 p-2 text-white">
          Criar Sala
        </button>

        <div>
          <input
            placeholder="Código da sala"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="border p-2"
          />

          <button
            onClick={joinRoom}
            className="bg-green-600 p-2 text-white ml-2"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl">Sala criada</h2>

        <p>
          Código da sala: <b>{currentRoom}</b>
        </p>

        <p>Aguardando outro jogador entrar...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p>Sala: {currentRoom}</p>
      <p>Você é: {color}</p>

      <ChessBoard gameFen={fen} playerColor={color!} onMove={handleMove} />
    </div>
  );
}
