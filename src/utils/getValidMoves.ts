import { isValidMove } from "./chessRules";

export function getValidMoves(
  board: string[],
  r: number,
  c: number,
  turn: "white" | "black"
) {
  const moves: { r: number; c: number }[] = [];

  for (let tr = 0; tr < 8; tr++) {
    for (let tc = 0; tc < 8; tc++) {
      if (isValidMove(board, r, c, tr, tc, turn)) {
        moves.push({ r: tr, c: tc });
      }
    }
  }

  return moves;
}