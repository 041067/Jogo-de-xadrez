const map: Record<string, string> = {
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

export default function ChessPiece({ piece }: { piece: string }) {
  if (piece === ".") return null;

  return (
    <span className="text-2xl select-none">
      {map[piece]}
    </span>
  );
}
