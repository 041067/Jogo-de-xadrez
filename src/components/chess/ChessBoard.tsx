import { useState } from "react";
import ChessSquare from "./ChessSquare";
import { isValidMove } from "@/utils/chessRules";

const initialBoard = [
  "rnbqkbnr",
  "pppppppp",
  "........",
  "........",
  "........",
  "........",
  "PPPPPPPP",
  "RNBQKBNR",
];

export default function ChessBoard() {
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState<string | null>(null);
  const [turn, setTurn] = useState<"white" | "black">("white");

  function handleClick(r: number, c: number) {
    const key = `${r}-${c}`;

    if (!selected) {
      if (board[r][c] !== ".") {
        setSelected(key);
      }
      return;
    }

    const [sr, sc] = selected.split("-").map(Number);

    if (
      isValidMove(board, sr, sc, r, c, turn)
    ) {
      const newBoard = board.map((row) => row.split(""));
      newBoard[r][c] = newBoard[sr][sc];
      newBoard[sr][sc] = ".";

      setBoard(newBoard.map((r) => r.join("")));
      setTurn(turn === "white" ? "black" : "white");
    }

    setSelected(null);
  }

  return (
    <div>
      <p className="mb-2 font-semibold">
        Turno: {turn === "white" ? "Brancas" : "Pretas"}
      </p>

      <div className="grid grid-cols-8 w-[320px] border-4 border-red-700">
        {board.map((row, r) =>
          row.split("").map((piece, c) => (
            <ChessSquare
              key={`${r}-${c}`}
              row={r}
              col={c}
              piece={piece}
              selected={selected === `${r}-${c}`}
              onClick={() => handleClick(r, c)}
            />
          ))
        )}
      </div>
    </div>
  );
}
