import { useRouter } from "next/router";
import GameCard from "@/components/GameCard";
import ChessGraffiti from "@/components/ChessGraffiti";

export default function Home() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 text-center mt-6 sm:mt-10">
        ♟️ Chess Masters
      </h1>

      <p className="text-lg sm:text-xl text-gray-400 text-center mb-8 sm:mb-12 max-w-2xl">
        Escolha seu modo de jogo e comece a jogar
      </p>

      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
        <GameCard
          title="Jogo Solo"
          description="Treine contra o computador e aprimore sua estratégia."
          onClick={() => router.push("/solo")}
        />

        <GameCard
          title="Criar Sala"
          description="Crie uma partida multiplayer e convide um amigo."
          onClick={() => router.push("/multiplayer")}
        />

        <GameCard
          title="Entrar em Sala"
          description="Entre em uma sala existente usando um código."
          onClick={() => router.push("/multiplayer")}
        />
      </div>

      {/* Graffiti section */}
      <div className="w-full mt-8 sm:mt-12 px-4">
        <ChessGraffiti />
      </div>
    </div>
  );
}
