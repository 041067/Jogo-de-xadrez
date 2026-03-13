interface Props {
  row: number;
  col: number;
  piece: string;
  selected: boolean;
  validMove?: boolean;
  onClick: () => void;
}

const pieceMap: Record<string, string> = {
  r: "♜",
  n: "♞",
  b: "♝",
  q: "♛",
  k: "♚",
  p: "♟",
  R: "♖",
  N: "♘",
  B: "♗",
  Q: "♕",
  K: "♔",
  P: "♙",
};

export default function ChessSquare({
  row,
  col,
  piece,
  selected,
  validMove,
  onClick,
}: Props) {
  const isDark = (row + col) % 2 === 1;

  return (
    <div
      onClick={onClick}
      className={`
        w-10 h-10 flex items-center justify-center
        ${isDark ? "bg-red-700" : "bg-white"}
        ${selected ? "ring-4 ring-yellow-400" : ""}
        ${validMove ? "ring-2 ring-green-400" : ""}
        cursor-pointer
      `}
    >
      <span className="text-xl select-none">
        {piece !== "." ? pieceMap[piece] : ""}
      </span>
    </div>
  );
}