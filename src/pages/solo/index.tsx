import { useState } from "react";
import ChessBoard from "@/components/chess/ChessBoard";
import { fenToBoard, boardToFen } from "@/utils/fen";

export default function SoloPage() {
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w",
  );

  function handleMove(newFen: string) {
    setFen(newFen);

    setTimeout(() => {
      makeAIMove(newFen);
    }, 500);
  }

  type Move = {
    sr: number;
    sc: number;
    tr: number;
    tc: number;
  };

  function makeAIMove(currentFen: string) {
    const board = fenToBoard(currentFen);

    const moves: Move[] = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];

        if (piece === piece.toLowerCase()) {
          const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ];

          directions.forEach(([dr, dc]) => {
            const nr = r + dr;
            const nc = c + dc;

            if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
              moves.push({
                sr: r,
                sc: c,
                tr: nr,
                tc: nc,
              });
            }
          });
        }
      }
    }

    if (moves.length === 0) return;

    const move = moves[Math.floor(Math.random() * moves.length)];

    const newBoard = structuredClone(board);

    newBoard[move.tr][move.tc] = newBoard[move.sr][move.sc];
    newBoard[move.sr][move.sc] = ".";

    const newFen = boardToFen(newBoard, "w");

    setFen(newFen);
  }

  return <ChessBoard gameFen={fen} playerColor="white" onMove={handleMove} />;
}
