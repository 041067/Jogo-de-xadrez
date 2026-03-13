import { useEffect, useState } from "react";
import ChessBoard from "@/components/chess/ChessBoard";
import { boardToFen, fenToBoard } from "@/utils/fen";
import { socket } from "@/lib/socket";

export default function Multiplayer() {
  const [roomId, setRoomId] = useState("");
  const [gameFen, setGameFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1"
  );

  useEffect(() => {
    socket.on("move", (fen: string) => {
      setGameFen(fen);
    });

    return () => {
      socket.off("move");
    };
  }, []);

  function createRoom() {
    const id = Math.random().toString(36).substring(2, 7);
    setRoomId(id);

    socket.emit("create-room", id);
  }

  function joinRoom() {
    socket.emit("join-room", roomId);
  }

  function handleMove(
    fr: number,
    fc: number,
    tr: number,
    tc: number
  ) {
    const board = fenToBoard(gameFen);
    const turn = gameFen.split(" ")[1] as "w" | "b";

    const newBoard = structuredClone(board);

    newBoard[tr][tc] = newBoard[fr][fc];
    newBoard[fr][fc] = ".";

    const nextTurn = turn === "w" ? "b" : "w";

    const boardStrings = newBoard.map((r) => r.join(""));

    const newFen = boardToFen(boardStrings, nextTurn);

    setGameFen(newFen);

    socket.emit("move", {
      roomId,
      fen: newFen,
    });
  }

  return (
    <div className="space-y-4">

      <h1 className="text-2xl font-bold">
        Multiplayer
      </h1>

      <div className="flex gap-2">
        <input
          className="border p-2"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2"
          onClick={createRoom}
        >
          Criar Sala
        </button>

        <button
          className="bg-green-600 text-white px-4 py-2"
          onClick={joinRoom}
        >
          Entrar
        </button>
      </div>

      <ChessBoard
        gameFen={gameFen}
        onMove={handleMove}
      />

    </div>
  );
}