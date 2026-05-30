import ChessPiece from "./ChessPiece";

type Props = {
  row: number;
  col: number;
  piece: string;
  selected: boolean;
  onClick: () => void;
};


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
      className={`flex items-center justify-center w-full h-full cursor-pointer
        ${isDark ? "bg-red-700" : "bg-gray-200"}
        ${selected ? "ring-4 ring-yellow-400" : ""}
      `}
    >
      {piece !== "." && <ChessPiece piece={piece} />}
    </div>
  );
}
