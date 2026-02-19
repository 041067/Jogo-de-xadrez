export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800 p-6 flex flex-col gap-8">
      {/* Logo */}
      <div className="text-2xl font-bold text-red-600 tracking-wide">
        ♟ Chess SENAI
      </div>

      {/* Navegação */}
      <nav className="flex flex-col gap-2">
        <button className="px-4 py-3 rounded-lg text-left hover:bg-neutral-800 transition-all active:scale-95">
          Jogo Solo
        </button>
        <button className="px-4 py-3 rounded-lg text-left hover:bg-neutral-800 transition-all active:scale-95">
          Multiplayer
        </button>
      </nav>
    </aside>
  );
}
