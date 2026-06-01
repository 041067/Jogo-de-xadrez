import Image from "next/image";

type Props = {
  row: number;
  col: number;
  piece: string;
  selected: boolean;
  onClick: () => void;
};

const pieceMap: Record<string, string> = {
  p: "/pieces/bP.svg",
  r: "/pieces/bR.svg",
  n: "/pieces/bN.svg",
  b: "/pieces/bB.svg",
  q: "/pieces/bQ.svg",
  k: "/pieces/bK.svg",
  P: "/pieces/wP.svg",
  R: "/pieces/wR.svg",
  N: "/pieces/wN.svg",
  B: "/pieces/wB.svg",
  Q: "/pieces/wQ.svg",
  K: "/pieces/wK.svg",
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
      className={`
        flex items-center justify-center
        w-full h-full cursor-pointer
        transition-all duration-150
        relative
        ${isDark ? "bg-red-700" : "bg-gray-200"}
        ${selected ? "ring-4 ring-yellow-400 ring-inset" : ""}
      `}
    >
      {piece !== "." && (
        <div className="relative w-4/5 h-4/5">
          <Image
            src={pieceMap[piece]}
            alt={piece}
            fill
            sizes="(max-width: 640px) 40px, (max-width: 768px) 50px, (max-width: 1024px) 70px, 100px"
            priority
            draggable={false}
            className="
              pointer-events-none
              select-none
              transition-transform
              duration-150
              hover:scale-110
              object-contain
            "
          />
        </div>
      )}
    </div>
  );
}