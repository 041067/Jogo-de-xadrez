import { useState, useEffect } from "react";
import ChessSquare from "./ChessSquare";
import { fenToBoard, boardToFen } from "@/utils/fen";

type Props = {
  gameFen: string;
  playerColor: "white" | "black";
  onMove: (fen: string) => void;
};

export default function ChessBoard({ gameFen, playerColor, onMove }: Props) {
  const [board, setBoard] = useState<string[][]>(fenToBoard(gameFen));
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setBoard(fenToBoard(gameFen));
  }, [gameFen]);

  const turn = gameFen.split(" ")[1] === "w" ? "white" : "black";

  function handleClick(r: number, c: number) {
    const key = `${r}-${c}`;

    if (turn !== playerColor) return;

    if (!selected) {
      const piece = board[r][c];
      if (piece === ".") return;

      const isWhite = piece === piece.toUpperCase();
      if (playerColor === "white" && !isWhite) return;
      if (playerColor === "black" && isWhite) return;

      setSelected(key);
      return;
    }

    const [sr, sc] = selected.split("-").map(Number);

    const newBoard = structuredClone(board);

    newBoard[r][c] = newBoard[sr][sc];
    newBoard[sr][sc] = ".";

    const nextTurn = turn === "white" ? "b" : "w";

    const newFen = boardToFen(newBoard, nextTurn);

    onMove(newFen);

    setSelected(null);
  }

  return (
    <div>
      <p>Turno: {turn}</p>

      <div className="grid grid-cols-8 w-[320px] h-[320px] border-5 border-red-700">
        {board.map((row, r) =>
          row.map((piece, c) => (
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