import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-red-600 text-white shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <h1 className="text-xl font-bold">♟ Chess SESI SENAI</h1>

        <nav className="flex gap-4">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <Link href="/solo" className="hover:underline">
            Solo
          </Link>
          <Link href="/multiplayer" className="hover:underline">
            Multiplayer
          </Link>
        </nav>
      </div>
    </header>
  );
}
