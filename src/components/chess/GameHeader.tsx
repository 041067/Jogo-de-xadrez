type Props = {
  title: string;
};

export default function GameHeader({ title }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>

      <div className="flex gap-3">
        <button className="
          px-4 py-2
          rounded-lg
          bg-neutral-800
          hover:bg-neutral-700
          transition
        ">
          Reiniciar
        </button>

        <button className="
          px-4 py-2
          rounded-lg
          bg-red-700
          hover:bg-red-600
          transition
        ">
          Desistir
        </button>
      </div>
    </div>
  );
}
