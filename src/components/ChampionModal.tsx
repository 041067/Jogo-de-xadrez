type Props = {
  isOpen: boolean;
  winner: "white" | "black";
  reason: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
};

export default function ChampionModal({
  isOpen,
  winner,
  reason,
  onPlayAgain,
  onBackToMenu,
}: Props) {
  if (!isOpen) return null;

  const winnerName = winner === "white" ? "⚪ Brancas" : "⚫ Pretas";
  const winnerColor =
    winner === "white" ? "from-gray-600 to-gray-500" : "from-gray-900 to-gray-800";
  const accentColor = winner === "white" ? "text-gray-300" : "text-gray-600";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div
        className={`
          w-full max-w-sm sm:max-w-md md:max-w-lg
          bg-gradient-to-b ${winnerColor}
          rounded-2xl sm:rounded-3xl
          border-4 sm:border-8 border-yellow-400
          shadow-2xl
          transform transition-all duration-500
          animate-in scale-95 opacity-0 slide-in-from-top-10
        `}
        style={{
          animation: isOpen ? "modalEntrance 0.6s ease-out forwards" : "none",
        }}
      >
        <style>{`
          @keyframes modalEntrance {
            0% {
              opacity: 0;
              transform: scale(0.9) translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}</style>

        {/* Crown/Trophy Icon */}
        <div className="text-center pt-6 sm:pt-8">
          <div className="text-5xl sm:text-6xl md:text-7xl animate-bounce">👑</div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8 text-center">
          {/* Winner Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-300 mb-2">
              CAMPEÃO!
            </h2>
            <p className={`text-xl sm:text-2xl md:text-3xl font-bold ${accentColor}`}>
              {winnerName}
            </p>
          </div>

          {/* Reason */}
          <div className="bg-black/40 rounded-xl p-4 sm:p-6 border-2 border-yellow-400/30">
            <p className="text-sm sm:text-base md:text-lg text-yellow-200 font-semibold">
              Motivo da Vitória
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-white font-bold mt-2">
              {reason}
            </p>
          </div>

          {/* Stats/Message */}
          <div className="text-sm sm:text-base md:text-lg text-gray-100">
            <p className="mb-2">🎉 Parabéns! 🎉</p>
            <p className="text-gray-300">
              {winner === "white"
                ? "As peças brancas venceram a partida!"
                : "As peças pretas venceram a partida!"}
            </p>
          </div>

          {/* Divider */}
          <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              onClick={onPlayAgain}
              className={`
                py-3 sm:py-4 px-4 sm:px-6
                rounded-lg sm:rounded-xl
                font-bold text-sm sm:text-base md:text-lg
                transition-all duration-300 transform
                hover:scale-105 active:scale-95
                bg-yellow-400 text-black
                hover:bg-yellow-300
                shadow-lg hover:shadow-xl
              `}
            >
              Jogar Novamente
            </button>

            <button
              onClick={onBackToMenu}
              className={`
                py-3 sm:py-4 px-4 sm:px-6
                rounded-lg sm:rounded-xl
                font-bold text-sm sm:text-base md:text-lg
                transition-all duration-300 transform
                hover:scale-105 active:scale-95
                bg-gray-700 text-white
                hover:bg-gray-600
                shadow-lg hover:shadow-xl
              `}
            >
              Menu Principal
            </button>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
      </div>
    </div>
  );
}
