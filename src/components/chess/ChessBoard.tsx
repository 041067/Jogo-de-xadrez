import { useState, useEffect } from "react";
import ChessSquare from "./ChessSquare";
import { fenToBoard, boardToFen } from "@/utils/fen";
import { getGameStatus, isValidMove } from "@/utils/chessRules";

type Props = {
  gameFen: string;
  playerColor: "white" | "black" | "both";
  onMove: (fen: string) => void;
  disabled?: boolean;
};

export default function ChessBoard({
  gameFen,
  playerColor,
  onMove,
  disabled = false,
}: Props) {
  const [board, setBoard] = useState<string[][]>(fenToBoard(gameFen));
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setBoard(fenToBoard(gameFen));
  }, [gameFen]);

  const turn = gameFen.split(" ")[1] === "w" ? "white" : "black";
  const activeColor = playerColor === "both" ? turn : playerColor;
  const canMoveCurrentTurn = playerColor === "both" || turn === playerColor;
  const gameStatus = getGameStatus(board, turn);

  function handleClick(r: number, c: number) {
    const key = `${r}-${c}`;

    // Valida se é o turno do jogador
    if (
      !canMoveCurrentTurn ||
      disabled ||
      gameStatus === "checkmate" ||
      gameStatus === "stalemate"
    ) {
      return;
    }

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
      const isPlayerWhite = activeColor === "white";
      
      if (isPieceWhite !== isPlayerWhite) return;
      
      setSelected(key);
      return;
    }

    const [sr, sc] = selected.split("-").map(Number);
    const selectedPiece = board[sr][sc];

    // Validação final: garante que a peça selecionada ainda pertence ao jogador
    const isPieceWhite = selectedPiece === selectedPiece.toUpperCase();
    const isPlayerWhite = activeColor === "white";
    
    if (isPieceWhite !== isPlayerWhite) {
      setSelected(null);
      return;
    }

    // Validação de regras de xadrez - verifica se o movimento é legal
    if (!isValidMove(board, sr, sc, r, c, turn)) {
      console.log("Movimento inválido segundo as regras de xadrez");
      setSelected(null);
      return;
    }

    const newBoard = structuredClone(board);

    const movingPiece = newBoard[sr][sc];
    newBoard[r][c] =
      movingPiece === "P" && r === 0
        ? "Q"
        : movingPiece === "p" && r === 7
          ? "q"
          : movingPiece;
    newBoard[sr][sc] = ".";

    const nextTurn = turn === "white" ? "b" : "w";

    const newFen = boardToFen(newBoard, nextTurn);

    onMove(newFen);

    setSelected(null);
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <p className="text-lg font-semibold" aria-live="polite">
        {gameStatus === "check"
          ? `Xeque nas ${turn === "white" ? "Brancas" : "Pretas"}!`
          : `Turno: ${turn === "white" ? "Brancas" : "Pretas"}`}
      </p>

      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl aspect-square">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full border-4 border-red-700 shadow-lg">
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
    </div>
  );
}
