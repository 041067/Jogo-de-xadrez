import ChessPiece from "./ChessPiece";

interface Props {
  row: number;
  col: number;
  piece: string;
  selected: boolean;
  onClick: () => void;
}

export default function ChessSquare({
  row,
  col,
  piece,
  selected,
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
        cursor-pointer
      `}
    >
      <ChessPiece piece={piece} />
    </div>
  );
}
