import ChessBoard from "@/components/chess/ChessBoard";
import GameHeader from "@/components/chess/GameHeader";

export default function MultiplayerGame() {
  return (
    <div className="flex flex-col items-center">
      <GameHeader title="Multiplayer" />

      <ChessBoard />
    </div>
  );
}
