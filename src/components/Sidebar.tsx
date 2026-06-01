"use client";

import { useRouter } from "next/router";
import { useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-white hover:border-red-600 transition-colors"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative
        w-64 bg-neutral-950 border-r border-neutral-800
        p-6 flex flex-col gap-8
        transition-all duration-300 ease-in-out
        md:translate-x-0 md:z-auto
        ${isOpen ? "translate-x-0 z-40" : "-translate-x-full md:translate-x-0"}
        top-0 left-0 h-screen md:h-auto
      `}>
        {/* Logo */}
        <div
          className="text-2xl font-bold text-red-600 tracking-wide cursor-pointer hover:text-red-500 transition-colors mt-12 md:mt-0"
          onClick={() => {
            router.push("/");
            setIsOpen(false);
          }}
        >
          ♟ SESI SENAI
        </div>

        {/* Navegação */}
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => {
              router.push("/solo");
              setIsOpen(false);
            }}
            className="px-4 py-3 rounded-lg text-left hover:bg-neutral-800 transition-all active:scale-95 text-white font-medium"
          >
            Jogo Solo
          </button>
          <button
            onClick={() => {
              router.push("/multiplayer");
              setIsOpen(false);
            }}
            className="px-4 py-3 rounded-lg text-left hover:bg-neutral-800 transition-all active:scale-95 text-white font-medium"
          >
            Multiplayer
          </button>
        </nav>

        {/* Botão Voltar */}
        <button
          onClick={() => {
            router.push("/");
            setIsOpen(false);
          }}
          className="mt-auto px-4 py-3 rounded-lg text-left hover:bg-red-600 hover:text-white transition-all active:scale-95 text-gray-300 font-medium border border-gray-600 hover:border-red-600"
        >
          ← Voltar para Home
        </button>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
