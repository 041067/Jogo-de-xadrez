import Link from "next/link";

export default function GameActions() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <button className="w-full py-3 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold">
        Reiniciar Partida
      </button>

      <Link
        href="/"
        className="w-full py-3 text-center border border-white hover:bg-white hover:text-black transition rounded-lg font-semibold"
      >
        Desistir e Voltar
      </Link>
    </div>
  );
}
