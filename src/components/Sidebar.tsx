"use client";

import { useRouter } from "next/router";
import Image from "next/image";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  function goTo(path: string) {
    router.push(path);
    setIsOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white hover:border-red-600 transition-colors"
      >
        {isOpen ? "Fechar" : "Menu"}
      </button>

      <aside
        className={`
        fixed md:relative
        w-64 bg-neutral-950 border-r border-neutral-800
        p-6 flex flex-col gap-8
        transition-all duration-300 ease-in-out
        md:translate-x-0 md:z-auto
        ${isOpen ? "translate-x-0 z-40" : "-translate-x-full md:translate-x-0"}
        top-0 left-0 h-screen md:h-auto
      `}
      >
        <div
          className="mt-12 flex cursor-pointer items-center gap-3 text-2xl font-bold tracking-wide text-red-600 transition-colors hover:text-red-500 md:mt-0"
          onClick={() => goTo("/")}
        >
          <Image
            src="/app-icon.svg"
            alt="Ícone ChessMaster"
            width={40}
            height={40}
            priority
          />
          <span>ChessMaster</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => goTo("/solo")}
            className="px-4 py-3 rounded-lg text-left hover:bg-neutral-800 transition-all active:scale-95 text-white font-medium"
          >
            Solo
          </button>
          <button
            onClick={() => goTo("/multiplayer")}
            className="px-4 py-3 rounded-lg text-left hover:bg-neutral-800 transition-all active:scale-95 text-white font-medium"
          >
            Multiplayer
          </button>
          <button
            onClick={() => goTo("/ai")}
            className="px-4 py-3 rounded-lg text-left hover:bg-neutral-800 transition-all active:scale-95 text-white font-medium"
          >
            Jogar contra IA
          </button>
        </nav>

        <button
          onClick={() => goTo("/")}
          className="mt-auto px-4 py-3 rounded-lg text-left hover:bg-red-600 hover:text-white transition-all active:scale-95 text-gray-300 font-medium border border-gray-600 hover:border-red-600"
        >
          Voltar para Home
        </button>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
