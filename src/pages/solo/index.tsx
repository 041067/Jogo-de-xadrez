import { useState } from "react";
import ChessBoard from "@/components/chess/ChessBoard";
import { boardToFen, fenToBoard } from "@/utils/fen";

export default function SoloGame() {
  const [gameFen, setGameFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1"
  );

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

    const boardStrings = newBoard.map((row) => row.join(""));

    setGameFen(boardToFen(boardStrings, nextTurn));
  }

  return (
    <ChessBoard
      gameFen={gameFen}
      onMove={handleMove}
    />
  );
}