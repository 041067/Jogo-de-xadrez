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

    // Valida se é o turno do jogador
    if (turn !== playerColor) return;

    if (selected === key) {
      setSelected(null);
      return;
    }

    if (!selected) {
      const piece = board[r][c];
      
      // Valida se a peça existe
      if (piece === ".") return;
      
      // Valida se a peça pertence ao jogador (maiúsculas = white, minúsculas = black)
      const isPieceWhite = piece === piece.toUpperCase();
      const isPlayerWhite = playerColor === "white";
      
      if (isPieceWhite !== isPlayerWhite) return;
      
      setSelected(key);
      return;
    }

    const [sr, sc] = selected.split("-").map(Number);
    const selectedPiece = board[sr][sc];

    // Validação final: garante que a peça selecionada ainda pertence ao jogador
    const isPieceWhite = selectedPiece === selectedPiece.toUpperCase();
    const isPlayerWhite = playerColor === "white";
    
    if (isPieceWhite !== isPlayerWhite) {
      setSelected(null);
      return;
    }

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

      <div className="grid grid-cols-8 grid-rows-8 w-[480px] h-[480px] border-4 border-red-700">
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
