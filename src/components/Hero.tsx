import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-24 px-6">
      <h1 className="text-4xl md:text-6xl font-extrabold text-white">
        Jogue Xadrez.
        <span className="block text-red-600 mt-2">
          Aprenda Estratégia.
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-gray-300 text-lg">
        Um projeto educacional desenvolvido no SESI SENAI SP
        para estimular raciocínio lógico, estratégia e tomada
        de decisão.
      </p>

      <div className="mt-10 flex gap-4 flex-wrap justify-center">
        <Link
          href="/solo"
          className="px-8 py-3 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold"
        >
          Jogar Solo
        </Link>

        <Link
          href="/multiplayer"
          className="px-8 py-3 border border-white hover:bg-white hover:text-black transition rounded-lg font-semibold"
        >
          Multiplayer
        </Link>
      </div>
    </section>
  );
}
