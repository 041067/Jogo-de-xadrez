type Props = {
  title: string;
  description: string;
  onClick?: () => void;
};

export default function GameCard({ title, description, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        bg-neutral-900
        border border-neutral-800
        rounded-xl
        p-6
        transition-all duration-200
        hover:border-red-600
        hover:scale-[1.02]
        active:scale-95
      "
    >
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-neutral-400">{description}</p>
    </div>
  );
}
