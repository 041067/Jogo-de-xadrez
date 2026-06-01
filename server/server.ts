import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://jogo-de-xadrez-xi.vercel.app",
    ],
    methods: ["GET", "POST"],
  },
});

type Room = {
  fen: string;
  players: { id: string; color: "white" | "black" }[];
  whiteTime: number; // tempo em segundos
  blackTime: number;
  lastMoveTime: number; // timestamp do último movimento
  timerInterval?: NodeJS.Timeout;
  gameStarted: boolean;
};

const rooms: Record<string, Room> = {};

// Função auxiliar para converter FEN para board
function fenToBoard(fen: string): string[][] {
  const board: string[][] = [];
  const rows = fen.split(" ")[0].split("/");

  for (const row of rows) {
    const boardRow: string[] = [];
    for (const char of row) {
      if (/\d/.test(char)) {
        boardRow.push(...Array(parseInt(char)).fill("."));
      } else {
        boardRow.push(char);
      }
    }
    board.push(boardRow);
  }

  return board;
}

// Função para validar se um movimento é legalmente válido
function isPathClear(
  board: string[][],
  fromR: number,
  fromC: number,
  toR: number,
  toC: number,
): boolean {
  const stepR = Math.sign(toR - fromR);
  const stepC = Math.sign(toC - fromC);

  let r = fromR + stepR;
  let c = fromC + stepC;

  while (r !== toR || c !== toC) {
    if (board[r] && board[r][c] && board[r][c] !== ".") return false;
    r += stepR;
    c += stepC;
  }

  return true;
}

function isValidChessMove(
  board: string[][],
  fromR: number,
  fromC: number,
  toR: number,
  toC: number,
  turn: "w" | "b",
): boolean {
  const piece = board[fromR]?.[fromC];
  const target = board[toR]?.[toC];

  if (!piece || piece === ".") return false;

  // Valida turno
  const isPieceWhite = piece === piece.toUpperCase();
  if ((turn === "w" && !isPieceWhite) || (turn === "b" && isPieceWhite))
    return false;

  // Valida se não captura própria peça
  if (
    target !== "." &&
    ((isPieceWhite && target === target.toUpperCase()) ||
      (!isPieceWhite && target === target.toLowerCase()))
  ) {
    return false;
  }

  const dr = toR - fromR;
  const dc = toC - fromC;

  switch (piece.toLowerCase()) {
    case "p": {
      const dir = isPieceWhite ? -1 : 1;
      if (dc === 0 && dr === dir && target === ".") return true;
      if (Math.abs(dc) === 1 && dr === dir && target !== ".") return true;
      return false;
    }
    case "r":
      if (dr === 0 || dc === 0) {
        return isPathClear(board, fromR, fromC, toR, toC);
      }
      return false;
    case "b":
      if (Math.abs(dr) === Math.abs(dc)) {
        return isPathClear(board, fromR, fromC, toR, toC);
      }
      return false;
    case "q":
      if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
        return isPathClear(board, fromR, fromC, toR, toC);
      }
      return false;
    case "n":
      return (
        (Math.abs(dr) === 2 && Math.abs(dc) === 1) ||
        (Math.abs(dr) === 1 && Math.abs(dc) === 2)
      );
    case "k":
      return Math.abs(dr) <= 1 && Math.abs(dc) <= 1;
    default:
      return false;
  }
}

// Função para detectar e validar o movimento
function validateMovement(oldFen: string, newFen: string): boolean {
  const oldTurn = oldFen.split(" ")[1] as "w" | "b";
  const oldBoard = fenToBoard(oldFen);
  const newBoard = fenToBoard(newFen);

  let fromR = -1,
    fromC = -1,
    toR = -1,
    toC = -1;

  // Encontra qual peça se moveu
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (oldBoard[r][c] !== newBoard[r][c]) {
        if (oldBoard[r][c] !== "." && newBoard[r][c] === ".") {
          fromR = r;
          fromC = c;
        } else if (oldBoard[r][c] === "." && newBoard[r][c] !== ".") {
          toR = r;
          toC = c;
        }
      }
    }
  }

  // Se não encontrou movimento válido
  if (fromR === -1 || toR === -1) {
    console.log("Não conseguiu detectar o movimento");
    return false;
  }

  // Valida se o movimento segue as regras de xadrez
  return isValidChessMove(oldBoard, fromR, fromC, toR, toC, oldTurn);
}

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("createRoom", ({ initialTime } = { initialTime: 600 }) => {
    const roomId = Math.random().toString(36).substring(2, 7);

    rooms[roomId] = {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w",
      players: [{ id: socket.id, color: "white" }],
      whiteTime: initialTime,
      blackTime: initialTime,
      lastMoveTime: Date.now(),
      gameStarted: false,
    };

    socket.join(roomId);

    socket.emit("roomCreated", {
      roomId,
      color: "white",
      whiteTime: initialTime,
      blackTime: initialTime,
    });

    console.log("Room created:", roomId);
  });

  socket.on("joinRoom", (roomId: string) => {
    const room = rooms[roomId];

    if (!room) {
      socket.emit("errorMessage", "Sala não encontrada");
      return;
    }

    if (room.players.length >= 2) {
      socket.emit("errorMessage", "Sala cheia");
      return;
    }

    room.players.push({ id: socket.id, color: "black" });
    room.gameStarted = true;

    socket.join(roomId);

    socket.emit("roomJoined", {
      roomId,
      color: "black",
      fen: room.fen,
      whiteTime: room.whiteTime,
      blackTime: room.blackTime,
    });

    io.to(roomId).emit("playersReady", {
      whiteTime: room.whiteTime,
      blackTime: room.blackTime,
    });

    // Inicia o timer no servidor
    startRoomTimer(roomId);
  });

  function startRoomTimer(roomId: string) {
    const room = rooms[roomId];
    if (!room) return;

    // Limpa interval anterior se existir
    if (room.timerInterval) {
      clearInterval(room.timerInterval);
    }

    room.timerInterval = setInterval(() => {
      if (!room.gameStarted) {
        clearInterval(room.timerInterval);
        return;
      }

      const currentTurn = room.fen.split(" ")[1] as "w" | "b";

      if (currentTurn === "w") {
        room.blackTime = Math.max(0, room.blackTime - 1);

        if (room.blackTime === 0) {
          io.to(roomId).emit("timeUp", { color: "black" });
          clearInterval(room.timerInterval);
          room.gameStarted = false;
          return;
        }
      } else {
        room.whiteTime = Math.max(0, room.whiteTime - 1);

        if (room.whiteTime === 0) {
          io.to(roomId).emit("timeUp", { color: "white" });
          clearInterval(room.timerInterval);
          room.gameStarted = false;
          return;
        }
      }

      // Envia sincronização de tempo a cada segundo
      io.to(roomId).emit("timeSync", {
        whiteTime: room.whiteTime,
        blackTime: room.blackTime,
      });
    }, 1000);
  }

  socket.on("move", ({ roomId, fen }) => {
    const room = rooms[roomId];
    if (!room) return;

    // Valida se o socket que fez o movimento é um jogador válido
    const player = room.players.find((p) => p.id === socket.id);
    if (!player) {
      console.log("Movimento rejeitado: jogador não pertence à sala");
      socket.emit("errorMessage", "Movimento inválido");
      return;
    }

    // Valida se é a vez do jogador
    const currentTurn = room.fen.split(" ")[1] as "w" | "b";
    const playerColor = player.color === "white" ? "w" : "b";

    if (currentTurn !== playerColor) {
      console.log(
        `Movimento rejeitado: não é a vez de ${player.color}. Turno atual: ${currentTurn}`,
      );
      socket.emit("errorMessage", "Não é a sua vez");
      return;
    }

    // Valida se o movimento segue as regras de xadrez
    if (!validateMovement(room.fen, fen)) {
      console.log("Movimento rejeitado: não segue as regras de xadrez");
      socket.emit(
        "errorMessage",
        "Movimento inválido - não segue as regras de xadrez",
      );
      return;
    }

    room.fen = fen;
    room.lastMoveTime = Date.now();

    io.to(roomId).emit("move", fen);
    io.to(roomId).emit("timeSync", {
      whiteTime: room.whiteTime,
      blackTime: room.blackTime,
    });
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);

    // Encontra e limpa a sala se o jogador era o proprietário
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex((p) => p.id === socket.id);

      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);

        if (room.players.length === 0) {
          // Limpa o timer se não houver mais jogadores
          if (room.timerInterval) {
            clearInterval(room.timerInterval);
          }
          delete rooms[roomId];
          console.log("Room deleted:", roomId);
        } else {
          // Notifica o outro jogador que o adversário desconectou
          io.to(roomId).emit("opponentDisconnected");
        }
      }
    }
  });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`♟️ Multiplayer server running on port ${PORT}`);
});
