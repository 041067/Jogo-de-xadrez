export function boardToFen(
  board: string[],
  turn: "w" | "b"
) {
  let fen = "";

  for (let r = 0; r < 8; r++) {
    let empty = 0;

    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];

      if (piece === ".") {
        empty++;
      } else {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        fen += piece;
      }
    }

    if (empty > 0) fen += empty;
    if (r < 7) fen += "/";
  }

  // mínimo viável
  return `${fen} ${turn} - - 0 1`;
}

export function fenToBoard(fen: string) {
  const [position] = fen.split(" ");
  const rows = position.split("/");

  return rows.map(row => {
    const result: string[] = [];

    for (const char of row) {
      if (!isNaN(Number(char))) {
        result.push(...Array(Number(char)).fill("."));
      } else {
        result.push(char);
      }
    }

    return result;
  });
}
