import Image from "next/image";

type Props = {
  row: number;
  col: number;
  piece: string;
  selected: boolean;
  onClick: () => void;
};

const pieceMap: Record<string, string> = {
  p: "/pieces/bp.svg",
  r: "/pieces/br.svg",
  n: "/pieces/bn.svg",
  b: "/pieces/bb.svg",
  q: "/pieces/bq.svg",
  k: "/pieces/bk.svg",
  P: "/pieces/wp.svg",
  R: "/pieces/wr.svg",
  N: "/pieces/wn.svg",
  B: "/pieces/wb.svg",
  Q: "/pieces/wq.svg",
  K: "/pieces/wk.svg",
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
      {piece !== "." && (
        <Image
          src={pieceMap[piece]}
          alt={piece}
          width={48}
          height={48}
          className="pointer-events-none select-none transition-transform duration-150 hover:scale-110"
        />
      )}
    </div>
  );
}
