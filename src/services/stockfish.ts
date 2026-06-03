import { boardToFen, fenToBoard } from "@/utils/fen";

export type StockfishDifficulty = "beginner" | "intermediate" | "advanced";

export type StockfishEvaluation = {
  display: string;
  label: string;
  centipawns: number | null;
  mate: number | null;
};

export type StockfishAnalysis = {
  bestMove: string;
  bestMoveDescription: string;
  depth: number;
  evaluation: StockfishEvaluation;
};

type RawScore =
  | {
      type: "cp";
      value: number;
    }
  | {
      type: "mate";
      value: number;
    };

type ActiveAnalysis = {
  fen: string;
  turn: "w" | "b";
  depth: number;
  lastScore: RawScore | null;
  resolve: (analysis: StockfishAnalysis) => void;
  reject: (error: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
};

type PendingLine = {
  predicate: (line: string) => boolean;
  resolve: (line: string) => void;
  reject: (error: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
};

type StockfishRuntime = {
  ccall: (
    command: string,
    returnType: null,
    argTypes: string[],
    args: string[],
    options?: { async?: boolean },
  ) => unknown;
  terminate?: () => void;
};

type StockfishScriptElement = HTMLScriptElement & {
  _exports?: (options: {
    locateFile: (path: string) => string;
    listener: (line: string) => void;
  }) => Promise<StockfishRuntime>;
};

export const AI_DIFFICULTIES: Record<
  StockfishDifficulty,
  { label: string; depth: number; skillLevel: number }
> = {
  beginner: {
    label: "Iniciante",
    depth: 5,
    skillLevel: 5,
  },
  intermediate: {
    label: "Intermediario",
    depth: 10,
    skillLevel: 12,
  },
  advanced: {
    label: "Avancado",
    depth: 15,
    skillLevel: 20,
  },
};

const STOCKFISH_SCRIPT = "/stockfish/stockfish-18-lite-single.js";
const STOCKFISH_WASM = "/stockfish/stockfish-18-lite-single.wasm";
const DEFAULT_ANALYSIS_DEPTH = 10;
const DEFAULT_TIMEOUT_MS = 120000;
const INIT_TIMEOUT_MS = 60000;
const READY_TIMEOUT_MS = 30000;

class StockfishBrowserService {
  private runtime: StockfishRuntime | null = null;
  private scriptElement: StockfishScriptElement | null = null;
  private initPromise: Promise<void> | null = null;
  private activeAnalysis: ActiveAnalysis | null = null;
  private waiters: PendingLine[] = [];
  private queue: Promise<unknown> = Promise.resolve();

  analyzePosition(
    fen: string,
    options: {
      depth?: number;
      skillLevel?: number;
      timeoutMs?: number;
    } = {},
  ): Promise<StockfishAnalysis> {
    const task = this.queue.then(() => this.runAnalysis(fen, options));
    this.queue = task.catch(() => undefined);

    return task;
  }

  terminate() {
    this.cancelCurrentAnalysis("Analise cancelada.");
    this.waiters.forEach((waiter) => {
      clearTimeout(waiter.timeoutId);
      waiter.reject(new Error("Stockfish finalizado."));
    });
    this.waiters = [];
    this.runtime?.terminate?.();
    this.scriptElement?.remove();
    this.runtime = null;
    this.scriptElement = null;
    this.initPromise = null;
  }

  cancelCurrentAnalysis(message = "Analise cancelada.") {
    if (!this.activeAnalysis) return;

    clearTimeout(this.activeAnalysis.timeoutId);
    this.activeAnalysis.reject(new Error(message));
    this.activeAnalysis = null;
    this.send("stop");
  }

  private async runAnalysis(
    fen: string,
    {
      depth = DEFAULT_ANALYSIS_DEPTH,
      skillLevel,
      timeoutMs = DEFAULT_TIMEOUT_MS,
    }: {
      depth?: number;
      skillLevel?: number;
      timeoutMs?: number;
    },
  ): Promise<StockfishAnalysis> {
    await this.ensureReady();

    if (typeof skillLevel === "number") {
      this.send(`setoption name Skill Level value ${skillLevel}`);
      await this.waitUntilReady();
    }

    const normalizedFen = normalizeFenForStockfish(fen);
    const turn = getFenTurn(normalizedFen);

    return new Promise<StockfishAnalysis>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (this.activeAnalysis) {
          this.send("stop");
          this.activeAnalysis = null;
        }

        reject(new Error("Stockfish demorou demais para responder."));
      }, timeoutMs);

      this.activeAnalysis = {
        fen,
        turn,
        depth,
        lastScore: null,
        resolve,
        reject,
        timeoutId,
      };

      this.send(`position fen ${normalizedFen}`);
      this.send(`go depth ${depth}`);
    });
  }

  private ensureReady(): Promise<void> {
    if (typeof window === "undefined") {
      return Promise.reject(
        new Error("Stockfish so pode ser iniciado no navegador."),
      );
    }

    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>(async (resolve, reject) => {
      try {
        const initEngine = await this.loadEngineScript();
        const scriptUrl = new URL(STOCKFISH_SCRIPT, window.location.origin);
        const wasmUrl = new URL(STOCKFISH_WASM, window.location.origin);

        this.runtime = await initEngine({
          locateFile(path: string) {
            if (path.includes(".wasm")) return wasmUrl.toString();
            return scriptUrl.toString();
          },
          listener: (line: string) => {
            this.handleLine(String(line));
          },
        });

        const uciReady = this.waitForLine(
          (line) => line === "uciok",
          INIT_TIMEOUT_MS,
        );
        this.send("uci");
        await uciReady;

        this.send("setoption name UCI_ShowWDL value false");
        await this.waitUntilReady();
        resolve();
      } catch (error) {
        this.failEngine(
          error instanceof Error
            ? error
            : new Error("Falha ao inicializar o Stockfish."),
        );
        reject(
          error instanceof Error
            ? error
            : new Error("Falha ao inicializar o Stockfish."),
        );
      }
    });

    return this.initPromise;
  }

  private loadEngineScript(): Promise<
    NonNullable<StockfishScriptElement["_exports"]>
  > {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script") as StockfishScriptElement;
      script.src = STOCKFISH_SCRIPT;
      script.async = true;

      script.onload = () => {
        if (typeof script._exports !== "function") {
          reject(new Error("Stockfish nao expos a API de inicializacao."));
          return;
        }

        this.scriptElement = script;
        resolve(script._exports);
      };

      script.onerror = () => {
        reject(new Error("Nao foi possivel carregar o Stockfish."));
      };

      document.body.appendChild(script);
    });
  }

  private async waitUntilReady() {
    const ready = this.waitForLine(
      (line) => line === "readyok",
      READY_TIMEOUT_MS,
    );
    this.send("isready");
    await ready;
  }

  private waitForLine(
    predicate: (line: string) => boolean,
    timeoutMs: number,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const waiter: PendingLine = {
        predicate,
        resolve,
        reject,
        timeoutId: setTimeout(() => {
          this.waiters = this.waiters.filter((item) => item !== waiter);
          reject(new Error("Stockfish nao respondeu a tempo."));
        }, timeoutMs),
      };

      this.waiters.push(waiter);
    });
  }

  private handleLine(line: string) {
    const waiter = this.waiters.find((item) => item.predicate(line));

    if (waiter) {
      clearTimeout(waiter.timeoutId);
      this.waiters = this.waiters.filter((item) => item !== waiter);
      waiter.resolve(line);
    }

    if (!this.activeAnalysis) return;

    const score = parseScore(line);
    if (score) {
      this.activeAnalysis.lastScore = score;
      return;
    }

    const bestMove = line.match(/^bestmove\s+(\S+)/)?.[1];
    if (!bestMove) return;

    const analysis = this.activeAnalysis;
    clearTimeout(analysis.timeoutId);
    this.activeAnalysis = null;

    if (bestMove === "(none)") {
      analysis.reject(new Error("Stockfish nao encontrou jogadas."));
      return;
    }

    analysis.resolve({
      bestMove,
      bestMoveDescription: describeUciMove(analysis.fen, bestMove),
      depth: analysis.depth,
      evaluation: buildEvaluation(analysis.lastScore, analysis.turn),
    });
  }

  private send(command: string) {
    if (!this.runtime) return;

    window.setTimeout(() => {
      try {
        this.runtime?.ccall("command", null, ["string"], [command], {
          async: /^go\b/.test(command),
        });
      } catch (error) {
        this.failEngine(
          error instanceof Error
            ? error
            : new Error("Falha ao enviar comando ao Stockfish."),
        );
      }
    }, 0);
  }

  private failEngine(error: Error) {
    this.cancelCurrentAnalysis(error.message);
    this.waiters.forEach((waiter) => {
      clearTimeout(waiter.timeoutId);
      waiter.reject(error);
    });
    this.waiters = [];
    this.runtime?.terminate?.();
    this.scriptElement?.remove();
    this.runtime = null;
    this.scriptElement = null;
    this.initPromise = null;
  }
}

export const stockfishService = new StockfishBrowserService();

export function analyzePosition(
  fen: string,
  options?: {
    depth?: number;
    skillLevel?: number;
    timeoutMs?: number;
  },
) {
  return stockfishService.analyzePosition(fen, options);
}

export function cancelStockfishAnalysis(message?: string) {
  stockfishService.cancelCurrentAnalysis(message);
}

export function normalizeFenForStockfish(fen: string): string {
  const [board, activeColor = "w", castling = "-", enPassant = "-", halfmove = "0", fullmove = "1"] =
    fen.trim().split(/\s+/);

  return [
    board,
    activeColor === "b" ? "b" : "w",
    castling || "-",
    enPassant || "-",
    halfmove || "0",
    fullmove || "1",
  ].join(" ");
}

export function applyUciMoveToFen(fen: string, move: string): string {
  const board = fenToBoard(fen);
  const from = parseUciSquare(move.slice(0, 2));
  const to = parseUciSquare(move.slice(2, 4));

  if (!from || !to) return fen;

  const piece = board[from.r]?.[from.c];
  if (!piece || piece === ".") return fen;

  const nextBoard = structuredClone(board);
  const target = nextBoard[to.r][to.c];
  const enPassantSquare = fen.trim().split(/\s+/)[3];

  if (
    piece.toLowerCase() === "p" &&
    target === "." &&
    from.c !== to.c &&
    enPassantSquare === move.slice(2, 4)
  ) {
    nextBoard[from.r][to.c] = ".";
  }

  nextBoard[to.r][to.c] = getPromotedPiece(piece, move[4]);
  nextBoard[from.r][from.c] = ".";

  moveCastleRook(nextBoard, piece, from, to);

  const nextTurn = getFenTurn(fen) === "w" ? "b" : "w";
  return boardToFen(nextBoard, nextTurn);
}

export function describeUciMove(fen: string, move: string): string {
  const board = fenToBoard(fen);
  const from = parseUciSquare(move.slice(0, 2));
  const to = parseUciSquare(move.slice(2, 4));

  if (!from || !to) return move;

  const piece = board[from.r]?.[from.c];
  if (!piece || piece === ".") return move;

  if (piece.toLowerCase() === "k" && Math.abs(to.c - from.c) === 2) {
    return to.c > from.c ? "Roque pequeno" : "Roque grande";
  }

  const target = board[to.r]?.[to.c];
  const capture = target && target !== "." ? " captura" : "";
  const promotion = move[4] ? ` promove para ${getPieceName(move[4])}` : "";

  return `${getPieceName(piece)} para ${formatSquare(move.slice(2, 4))}${capture}${promotion}`;
}

function parseScore(line: string): RawScore | null {
  const match = line.match(/\bscore\s+(cp|mate)\s+(-?\d+)/);
  if (!match) return null;

  return {
    type: match[1] as RawScore["type"],
    value: Number(match[2]),
  };
}

function buildEvaluation(
  score: RawScore | null,
  turn: "w" | "b",
): StockfishEvaluation {
  if (!score) {
    return {
      display: "+0.0",
      label: "Posicao equilibrada",
      centipawns: 0,
      mate: null,
    };
  }

  const perspective = turn === "w" ? 1 : -1;

  if (score.type === "mate") {
    const mate = score.value * perspective;

    return {
      display: mate > 0 ? `M${mate}` : `-M${Math.abs(mate)}`,
      label: mate > 0 ? "Mate favoravel as Brancas" : "Mate favoravel as Pretas",
      centipawns: null,
      mate,
    };
  }

  const centipawns = score.value * perspective;
  const pawns = centipawns / 100;

  return {
    display: `${pawns >= 0 ? "+" : ""}${pawns.toFixed(1)}`,
    label:
      Math.abs(pawns) < 0.2
        ? "Posicao equilibrada"
        : pawns > 0
          ? "Vantagem Brancas"
          : "Vantagem Pretas",
    centipawns,
    mate: null,
  };
}

function getFenTurn(fen: string): "w" | "b" {
  return fen.trim().split(/\s+/)[1] === "b" ? "b" : "w";
}

function parseUciSquare(square: string) {
  if (!/^[a-h][1-8]$/.test(square)) return null;

  return {
    r: 8 - Number(square[1]),
    c: square.charCodeAt(0) - "a".charCodeAt(0),
  };
}

function getPromotedPiece(piece: string, promotion?: string) {
  if (!promotion) return piece;

  return piece === piece.toUpperCase()
    ? promotion.toUpperCase()
    : promotion.toLowerCase();
}

function moveCastleRook(
  board: string[][],
  piece: string,
  from: { r: number; c: number },
  to: { r: number; c: number },
) {
  if (piece.toLowerCase() !== "k" || Math.abs(to.c - from.c) !== 2) return;

  if (to.c > from.c) {
    board[from.r][5] = board[from.r][7];
    board[from.r][7] = ".";
  } else {
    board[from.r][3] = board[from.r][0];
    board[from.r][0] = ".";
  }
}

function getPieceName(piece: string) {
  const names: Record<string, string> = {
    p: "Peao",
    n: "Cavalo",
    b: "Bispo",
    r: "Torre",
    q: "Rainha",
    k: "Rei",
  };

  return names[piece.toLowerCase()] ?? "Peca";
}

function formatSquare(square: string) {
  return square.toUpperCase();
}
