export type ConnectionState =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "offline";

type Props = {
  state: ConnectionState;
};

const details: Record<
  ConnectionState,
  { label: string; description: string; value: number; color: string }
> = {
  connecting: {
    label: "Preparando o tabuleiro online",
    description: "Conectando ao servidor...",
    value: 62,
    color: "from-amber-400 via-yellow-300 to-amber-500",
  },
  reconnecting: {
    label: "Reconectando as peças",
    description: "Tentando restaurar a conexão...",
    value: 46,
    color: "from-orange-500 via-amber-300 to-orange-500",
  },
  connected: {
    label: "Tabuleiro online",
    description: "Conexão com o servidor estabelecida",
    value: 100,
    color: "from-emerald-500 via-green-400 to-emerald-500",
  },
  offline: {
    label: "Servidor indisponível",
    description: "Aguardando uma nova tentativa de conexão...",
    value: 100,
    color: "from-red-600 via-rose-500 to-red-600",
  },
};

export default function ConnectionIndicator({ state }: Props) {
  const detail = details[state];
  const isInProgress = state === "connecting" || state === "reconnecting";

  return (
    <section
      className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900/90 p-4 shadow-lg"
      aria-live="polite"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`h-3 w-3 shrink-0 rounded-full ${
              state === "connected"
                ? "bg-emerald-400"
                : state === "offline"
                  ? "bg-red-500"
                  : "bg-amber-300 animate-pulse"
            }`}
          />
          <p className="truncate text-sm font-bold text-white">{detail.label}</p>
        </div>
        <span className="shrink-0 text-xs font-semibold text-gray-400">
          {state === "connected" ? "100%" : isInProgress ? "..." : "indisponível"}
        </span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-black/50"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={detail.value}
        aria-label={detail.description}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${detail.color} ${
            isInProgress ? "connection-progress" : ""
          }`}
          style={{ width: `${detail.value}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-gray-400">{detail.description}</p>
    </section>
  );
}
