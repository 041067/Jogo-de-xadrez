import ChessBoard from "@/components/chess/ChessBoard";
import GameHeader from "@/components/chess/GameHeader";

export default function SoloGame() {
  return (
    <div className="flex flex-col items-center">
      <GameHeader title="Modo Solo" />

      <ChessBoard />
    </div>
  );
}
