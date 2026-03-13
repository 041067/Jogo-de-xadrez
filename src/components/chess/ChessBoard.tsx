import { useState } from "react";
import ChessSquare from "./ChessSquare";
import { isValidMove } from "@/utils/chessRules";
import { fenToBoard } from "@/utils/fen";

type ChessBoardProps = {
  gameFen: string;
  onMove: (fr: number, fc: number, tr: number, tc: number) => void;
};

export default function ChessBoard({ gameFen, onMove }: ChessBoardProps) {
  const board = fenToBoard(gameFen);
  const turn = gameFen.split(" ")[1] === "w" ? "white" : "black";

  const [selected, setSelected] = useState<string | null>(null);

  function handleClick(r: number, c: number) {
    const key = `${r}-${c}`;

    if (!selected) {
      if (board[r][c] !== ".") {
        setSelected(key);
      }
      return;
    }

    const [sr, sc] = selected.split("-").map(Number);

    const boardStrings = board.map((row) => row.join(""));

    if (isValidMove(boardStrings, sr, sc, r, c, turn)) {
      onMove(sr, sc, r, c);
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
          row.map((piece, c) => (
            <ChessSquare
              key={`${r}-${c}`}
              row={r}
              col={c}
              piece={piece}
              selected={selected === `${r}-${c}`}
              onClick={() => handleClick(r, c)}
            />
          )),
        )}
      </div>
    </div>
  );
}
