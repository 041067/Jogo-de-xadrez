import Link from "next/link";

export default function MultiplayerActions() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <button className="w-full py-3 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold">
        Criar Sala
      </button>

      <input
        type="text"
        placeholder="Código da sala"
        className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-700 focus:outline-none focus:border-red-600"
      />

      <button className="w-full py-3 bg-neutral-800 hover:bg-neutral-700 transition rounded-lg font-semibold">
        Entrar na Sala
      </button>

      <Link
        href="/"
        className="w-full py-3 text-center border border-white hover:bg-white hover:text-black transition rounded-lg font-semibold"
      >
        Voltar para Home
      </Link>
    </div>
  );
}
