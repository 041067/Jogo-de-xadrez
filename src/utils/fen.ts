export function fenToBoard(fen: string): string[][] {
  const [boardPart] = fen.split(" ");

  return boardPart.split("/").map((row) => {
    const squares: string[] = [];

    for (const char of row) {
      if (!isNaN(Number(char))) {
        squares.push(...Array(Number(char)).fill("."));
      } else {
        squares.push(char);
      }
    }

    return squares;
  });
}

export function boardToFen(board: string[][], turn: string): string {
  const fenRows = board.map((row) => {
    let empty = 0;
    let fenRow = "";

    for (const square of row) {
      if (square === ".") {
        empty++;
      } else {
        if (empty > 0) {
          fenRow += empty;
          empty = 0;
        }
        fenRow += square;
      }
    }

    if (empty > 0) fenRow += empty;

    return fenRow;
  });

  return `${fenRows.join("/")} ${turn}`;
}