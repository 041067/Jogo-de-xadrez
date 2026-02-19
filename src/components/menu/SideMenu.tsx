import Link from "next/link";

export default function HomeMenu() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
      <h1 className="text-3xl font-bold text-red-700 mb-2">
        Chess SESI SENAI
      </h1>

      <p className="text-gray-600 mb-8">
        Jogo de xadrez educativo
      </p>

      <div className="flex flex-col gap-4">
        <Link href="/solo">
          <button className="w-full py-3 rounded-xl bg-red-700 text-white font-semibold hover:bg-red-800 transition">
            🎮 Modo Solo
          </button>
        </Link>

        <Link href="/multiplayer">
          <button className="w-full py-3 rounded-xl border-2 border-red-700 text-red-700 font-semibold hover:bg-red-700 hover:text-white transition">
            🌐 Modo Multiplayer
          </button>
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-8">
        SESI SENAI SP • Projeto Educacional
      </p>
    </div>
  );
}
