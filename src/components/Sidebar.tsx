"use client";

import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800 p-6 flex flex-col gap-8">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-600 tracking-wide cursor-pointer hover:text-red-500 transition-colors" onClick={() => router.push("/")}>
        ♟ SESI SENAI
      </div>

      {/* Navegação */}
      <nav className="flex flex-col gap-2">
        <button
          onClick={() => router.push("/solo")}
          className="px-4 py-3 rounded-lg text-left hover:bg-neutral-800 transition-all active:scale-95 text-white font-medium"
        >
          Jogo Solo
        </button>
        <button
          onClick={() => router.push("/multiplayer")}
          className="px-4 py-3 rounded-lg text-left hover:bg-neutral-800 transition-all active:scale-95 text-white font-medium"
        >
          Multiplayer
        </button>
      </nav>

      {/* Botão Voltar */}
      <button
        onClick={() => router.push("/")}
        className="mt-auto px-4 py-3 rounded-lg text-left hover:bg-red-600 hover:text-white transition-all active:scale-95 text-gray-300 font-medium border border-gray-600 hover:border-red-600"
      >
        ← Voltar para Home
      </button>
    </aside>
  );
}
