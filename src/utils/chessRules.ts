export function isWhite(piece: string) {
  return piece === piece.toUpperCase();
}

export function isBlack(piece: string) {
  return piece === piece.toLowerCase();
}

export function sameColor(a: string, b: string) {
  return (isWhite(a) && isWhite(b)) || (isBlack(a) && isBlack(b));
}

function isPathClear(
  board: string[],
  fromR: number,
  fromC: number,
  toR: number,
  toC: number,
) {
  const stepR = Math.sign(toR - fromR);
  const stepC = Math.sign(toC - fromC);

  let r = fromR + stepR;
  let c = fromC + stepC;

  while (r !== toR || c !== toC) {
    if (board[r][c] !== ".") return false;
    r += stepR;
    c += stepC;
  }

  return true;
}

export function isValidMove(
  board: string[],
  fromR: number,
  fromC: number,
  toR: number,
  toC: number,
  turn: "white" | "black",
) {
  const piece = board[fromR][fromC];
  const target = board[toR][toC];

  if (piece === ".") return false;

  if (turn === "white" && isBlack(piece)) return false;
  if (turn === "black" && isWhite(piece)) return false;

  if (target !== "." && sameColor(piece, target)) return false;

  const dr = toR - fromR;
  const dc = toC - fromC;

  switch (piece.toLowerCase()) {
    case "p": {
      const dir = isWhite(piece) ? -1 : 1;

      if (dc === 0 && dr === dir && target === ".") return true;
      if (Math.abs(dc) === 1 && dr === dir && target !== ".") return true;

      return false;
    }

    case "r":
      if (dr === 0 || dc === 0) {
        return isPathClear(board, fromR, fromC, toR, toC);
      }
      return false;

    case "b":
      if (Math.abs(dr) === Math.abs(dc)) {
        return isPathClear(board, fromR, fromC, toR, toC);
      }
      return false;

    case "q":
      if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
        return isPathClear(board, fromR, fromC, toR, toC);
      }
      return false;

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
