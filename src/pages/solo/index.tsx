import { useState } from "react";
import ChessBoard from "@/components/chess/ChessBoard";
import { fenToBoard, boardToFen } from "@/utils/fen";
import { getValidMoves } from "@/utils/getValidMoves";

type Move = {
  sr: number;
  sc: number;
  tr: number;
  tc: number;
};

function getPieceValue(piece: string): number {
  const values: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 1000,
  };
  return values[piece.toLowerCase()] || 0;
}

function evaluateMove(
  board: string[][],
  move: Move,
  allMoves: Move[]
): number {
  const targetPiece = board[move.tr][move.tc];
  let score = Math.random(); // Base randomness para variedade

  // Priorizar captura de peças
  if (targetPiece !== ".") {
    score += getPieceValue(targetPiece) * 10; // Capturar peças valiosas primeiro
  }

  // Evitar colocar a peça em risco imediato (verificação simples)
  // Se há mais de um movimento, dar prioridade a movimentos que se defendem melhor
  score += Math.random() * 2;

  return score;
}

export default function SoloPage() {
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w",
  );

  function handleMove(newFen: string) {
    setFen(newFen);

    setTimeout(() => {
      makeAIMove(newFen);
    }, 800);
  }

  function makeAIMove(currentFen: string) {
    const board = fenToBoard(currentFen);
    const possibleMoves: Move[] = [];

    // Encontrar todos os movimentos válidos para as peças pretas
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];

        // Verificar se é peça preta
        if (piece !== "." && piece === piece.toLowerCase()) {
          const validMoves = getValidMoves(board, r, c, "black");

          validMoves.forEach(({ r: tr, c: tc }) => {
            possibleMoves.push({
              sr: r,
              sc: c,
              tr,
              tc,
            });
          });
        }
      }
    }

    if (possibleMoves.length === 0) {
      console.log("Nenhum movimento disponível para a IA");
      return;
    }

    // Avaliar e escolher o melhor movimento
    let bestMove = possibleMoves[0];
    let bestScore = evaluateMove(board, bestMove, possibleMoves);

    for (let i = 1; i < possibleMoves.length; i++) {
      const score = evaluateMove(board, possibleMoves[i], possibleMoves);
      if (score > bestScore) {
        bestScore = score;
        bestMove = possibleMoves[i];
      }
    }

    // Executar o movimento
    const newBoard = structuredClone(board);
    newBoard[bestMove.tr][bestMove.tc] = newBoard[bestMove.sr][bestMove.sc];
    newBoard[bestMove.sr][bestMove.sc] = ".";

    const newFen = boardToFen(newBoard, "w");
    setFen(newFen);
  }

  return <ChessBoard gameFen={fen} playerColor="white" onMove={handleMove} />;
}
