import { useState } from "react";
import ChessSquare from "./ChessSquare";
import { isValidMove } from "@/utils/chessRules";
import { fenToBoard } from "@/utils/fen";
import { getValidMoves } from "@/utils/getValidMoves";

type ChessBoardProps = {
  gameFen: string;
  onMove: (
    fr: number,
    fc: number,
    tr: number,
    tc: number
  ) => void;
};

export default function ChessBoard({ gameFen, onMove }: ChessBoardProps) {
  const board = fenToBoard(gameFen);
  const turn = gameFen.split(" ")[1] === "w" ? "white" : "black";

  const [selected, setSelected] = useState<string | null>(null);
  const [validMoves, setValidMoves] = useState<{ r: number; c: number }[]>([]);

  function handleClick(r: number, c: number) {
    const key = `${r}-${c}`;

    const boardStrings = board.map((row) => row.join(""));

    if (!selected) {
      if (board[r][c] !== ".") {
        setSelected(key);

        const moves = getValidMoves(boardStrings, r, c, turn);
        setValidMoves(moves);
      }
      return;
    }

    const [sr, sc] = selected.split("-").map(Number);

    const isMoveValid = validMoves.some(
      (m) => m.r === r && m.c === c
    );

    if (isMoveValid) {
      onMove(sr, sc, r, c);
    }

    setSelected(null);
    setValidMoves([]);
  }

  return (
    <div>
      <p className="mb-2 font-semibold">
        Turno: {turn === "white" ? "Brancas" : "Pretas"}
      </p>

      <div className="grid grid-cols-8 w-[320px] border-4 border-red-700">
        {board.map((row, r) =>
          row.map((piece, c) => {
            const isValid = validMoves.some(
              (m) => m.r === r && m.c === c
            );

            return (
              <ChessSquare
                key={`${r}-${c}`}
                row={r}
                col={c}
                piece={piece}
                selected={selected === `${r}-${c}`}
                validMove={isValid}
                onClick={() => handleClick(r, c)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}