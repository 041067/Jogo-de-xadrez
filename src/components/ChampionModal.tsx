type PlayerColor = "white" | "black";

type Props = {
  isOpen: boolean;
  winner: PlayerColor;
  reason: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  playerColor?: PlayerColor;
};

export default function ChampionModal({
  isOpen,
  winner,
  reason,
  onPlayAgain,
  onBackToMenu,
  playerColor,
}: Props) {
  if (!isOpen) return null;

  const winnerName = winner === "white" ? "Brancas" : "Pretas";
  const isCheckmate = reason.startsWith("Xeque-mate");
  const playerWon = playerColor ? winner === playerColor : null;
  const title =
    playerWon === true
      ? "VOCÊ VENCEU!"
      : playerWon === false
        ? "VOCÊ PERDEU"
        : isCheckmate
          ? "XEQUE-MATE!"
          : "PARTIDA ENCERRADA";
  const message =
    playerWon === true
      ? "Uma jogada de mestre. O tabuleiro é seu!"
      : playerWon === false
        ? "Boa partida! Analise a posição e tente outra estratégia."
        : `Vitória das ${winnerName}.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-over-title"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="confetti confetti-one" />
        <span className="confetti confetti-two" />
        <span className="confetti confetti-three" />
        <span className="confetti confetti-four" />
      </div>

      <div className="game-over-modal relative w-full max-w-md overflow-hidden rounded-3xl border-4 border-yellow-400 bg-gradient-to-b from-neutral-700 to-neutral-950 shadow-2xl">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-red-500 via-yellow-300 to-red-500" />

        <div className="px-6 pb-7 pt-8 text-center sm:px-9 sm:pb-9 sm:pt-10">
          <div className="winner-piece mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-yellow-300 bg-black/35 text-5xl text-yellow-200 shadow-lg sm:h-24 sm:w-24 sm:text-6xl">
            {playerWon === false ? "♚" : "♛"}
          </div>

          <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-yellow-300/90">
            Fim de jogo
          </p>
          <h2
            id="game-over-title"
            className="mt-2 text-3xl font-black text-white sm:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-2 text-lg font-bold text-yellow-200">
            {winnerName} vencem
          </p>

          <div className="mt-6 rounded-2xl border border-yellow-300/30 bg-black/35 p-4">
            <p className="text-base font-semibold text-white">{reason}</p>
            <p className="mt-2 text-sm text-gray-300">{message}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={onPlayAgain}
              className="rounded-xl bg-yellow-400 px-3 py-3 font-bold text-black transition-transform hover:scale-[1.03] hover:bg-yellow-300 active:scale-95"
            >
              Jogar novamente
            </button>
            <button
              onClick={onBackToMenu}
              className="rounded-xl border border-gray-500 bg-neutral-800 px-3 py-3 font-bold text-white transition-transform hover:scale-[1.03] hover:bg-neutral-700 active:scale-95"
            >
              Menu principal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
