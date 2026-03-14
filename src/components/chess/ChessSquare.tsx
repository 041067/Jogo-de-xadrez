type Props = {
  row: number;
  col: number;
  piece: string;
  selected: boolean;
  onClick: () => void;
};

const pieces: Record<string, string> = {
  p: "♟",
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚",
  P: "♙",
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔",
};

export default function ChessSquare({
  row,
  col,
  piece,
  selected,
  onClick,
}: Props) {
  const isDark = (row + col) % 2 === 1;

  const pieceSymbol = pieces[piece] ?? "";

  const isWhite = piece === piece.toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center text-4xl cursor-pointer
      ${isDark ? "bg-red-700" : "bg-gray-200"}
      ${selected ? "ring-4 ring-yellow-400" : ""}
    `}
    >
      <span
        className={`select-none
        ${
          isWhite
            ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
            : "text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]"
        }
      `}
      >
        {pieceSymbol}
      </span>
    </div>
  );
}
