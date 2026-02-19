import { useRouter } from "next/router";
import GameCard from "@/components/GameCard";

export default function Home() {
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Escolha seu modo de jogo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  );
}
