export type PlayerColor = "white" | "black";

export type ChessMove = {
  fromR: number;
  fromC: number;
  toR: number;
  toC: number;
};

export type GameStatus = "active" | "check" | "checkmate" | "stalemate";

function inBounds(row: number, col: number) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

export function isWhite(piece: string) {
  return piece !== "." && piece === piece.toUpperCase();
}

export function isBlack(piece: string) {
  return piece !== "." && piece === piece.toLowerCase();
}

export function sameColor(a: string, b: string) {
  return (
    a !== "." &&
    b !== "." &&
    ((isWhite(a) && isWhite(b)) || (isBlack(a) && isBlack(b)))
  );
}

function belongsToColor(piece: string, color: PlayerColor) {
  return color === "white" ? isWhite(piece) : isBlack(piece);
}

function oppositeColor(color: PlayerColor): PlayerColor {
  return color === "white" ? "black" : "white";
}

function isPathClear(
  board: string[][],
  fromR: number,
  fromC: number,
  toR: number,
  toC: number,
) {
  const stepR = Math.sign(toR - fromR);
  const stepC = Math.sign(toC - fromC);

  let row = fromR + stepR;
  let col = fromC + stepC;

  while (row !== toR || col !== toC) {
    if (board[row][col] !== ".") return false;

    row += stepR;
    col += stepC;
  }

  return true;
}

/**
 * Verifica o movimento da peça sem considerar se o rei ficará em xeque.
 * Use isValidMove para validar uma jogada de partida.
 */
export function isPseudoLegalMove(
  board: string[][],
  fromR: number,
  fromC: number,
  toR: number,
  toC: number,
  turn: PlayerColor,
) {
  if (!inBounds(fromR, fromC) || !inBounds(toR, toC)) return false;
  if (fromR === toR && fromC === toC) return false;

  const piece = board[fromR][fromC];
  const target = board[toR][toC];

  if (piece === "." || !belongsToColor(piece, turn)) return false;
  if (sameColor(piece, target)) return false;

  // O rei nunca é capturado: a partida termina em xeque-mate antes disso.
  if (target.toLowerCase() === "k") return false;

  const dr = toR - fromR;
  const dc = toC - fromC;

  switch (piece.toLowerCase()) {
    case "p": {
      const direction = isWhite(piece) ? -1 : 1;
      const startRow = isWhite(piece) ? 6 : 1;

      if (dc === 0 && dr === direction && target === ".") return true;

      if (
        fromR === startRow &&
        dc === 0 &&
        dr === direction * 2 &&
        target === "." &&
        board[fromR + direction][fromC] === "."
      ) {
        return true;
      }

      return Math.abs(dc) === 1 && dr === direction && target !== ".";
    }

    case "r":
      return (dr === 0 || dc === 0) && isPathClear(board, fromR, fromC, toR, toC);

    case "b":
      return Math.abs(dr) === Math.abs(dc) && isPathClear(board, fromR, fromC, toR, toC);

    case "q":
      return (
        (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) &&
        isPathClear(board, fromR, fromC, toR, toC)
      );

    case "n":
      return (
        (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
        (Math.abs(dr) === 1 && Math.abs(dc) === 2)
      );

    case "k":
      return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;

    default:
      return false;
  }
}

function attacksSquare(
  board: string[][],
  fromR: number,
  fromC: number,
  toR: number,
  toC: number,
) {
  const piece = board[fromR][fromC];
  if (piece === ".") return false;

  const dr = toR - fromR;
  const dc = toC - fromC;

  switch (piece.toLowerCase()) {
    case "p":
      return dr === (isWhite(piece) ? -1 : 1) && Math.abs(dc) === 1;
    case "r":
      return (dr === 0 || dc === 0) && isPathClear(board, fromR, fromC, toR, toC);
    case "b":
      return Math.abs(dr) === Math.abs(dc) && isPathClear(board, fromR, fromC, toR, toC);
    case "q":
      return (
        (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) &&
        isPathClear(board, fromR, fromC, toR, toC)
      );
    case "n":
      return (
        (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
        (Math.abs(dr) === 1 && Math.abs(dc) === 2)
      );
    case "k":
      return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
    default:
      return false;
  }
}

export function isSquareAttacked(
  board: string[][],
  row: number,
  col: number,
  byColor: PlayerColor,
) {
  for (let fromR = 0; fromR < 8; fromR++) {
    for (let fromC = 0; fromC < 8; fromC++) {
      if (
        belongsToColor(board[fromR][fromC], byColor) &&
        attacksSquare(board, fromR, fromC, row, col)
      ) {
        return true;
      }
    }
  }

  return false;
}

function findKing(board: string[][], color: PlayerColor) {
  const king = color === "white" ? "K" : "k";

  for (let row = 0; row < 8; row++) {
    const col = board[row].indexOf(king);
    if (col !== -1) return { row, col };
  }

  return null;
}

export function isInCheck(board: string[][], color: PlayerColor) {
  const king = findKing(board, color);
  if (!king) return true;

  return isSquareAttacked(board, king.row, king.col, oppositeColor(color));
}

function applyMove(board: string[][], move: ChessMove) {
  const nextBoard = board.map((row) => [...row]);
  const piece = nextBoard[move.fromR][move.fromC];

  nextBoard[move.toR][move.toC] =
    piece === "P" && move.toR === 0
      ? "Q"
      : piece === "p" && move.toR === 7
        ? "q"
        : piece;
  nextBoard[move.fromR][move.fromC] = ".";

  return nextBoard;
}

/** Retorna true apenas para uma jogada permitida pelas regras e segura para o rei. */
export function isValidMove(
  board: string[][],
  fromR: number,
  fromC: number,
  toR: number,
  toC: number,
  turn: PlayerColor,
) {
  if (!isPseudoLegalMove(board, fromR, fromC, toR, toC, turn)) return false;

  return !isInCheck(
    applyMove(board, { fromR, fromC, toR, toC }),
    turn,
  );
}

export function getLegalMoves(board: string[][], turn: PlayerColor): ChessMove[] {
  const moves: ChessMove[] = [];

  for (let fromR = 0; fromR < 8; fromR++) {
    for (let fromC = 0; fromC < 8; fromC++) {
      if (!belongsToColor(board[fromR][fromC], turn)) continue;

      for (let toR = 0; toR < 8; toR++) {
        for (let toC = 0; toC < 8; toC++) {
          if (isValidMove(board, fromR, fromC, toR, toC, turn)) {
            moves.push({ fromR, fromC, toR, toC });
          }
        }
      }
    }
  }

  return moves;
}

export function getGameStatus(board: string[][], turn: PlayerColor): GameStatus {
  const inCheck = isInCheck(board, turn);
  const hasLegalMove = getLegalMoves(board, turn).length > 0;

  if (!hasLegalMove) return inCheck ? "checkmate" : "stalemate";
  return inCheck ? "check" : "active";
}
