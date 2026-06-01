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
        rounded-lg sm:rounded-xl
        p-4 sm:p-6
        transition-all duration-200
        hover:border-red-600
        hover:scale-[1.02]
        hover:shadow-lg hover:shadow-red-600/20
        active:scale-95
        min-h-[140px] sm:min-h-[160px]
        flex flex-col justify-between
      "
    >
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-2 text-white">{title}</h2>
        <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
