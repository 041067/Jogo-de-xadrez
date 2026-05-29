import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
  transports: ["websocket"],
});

type Room = {
  fen: string;
  players: { id: string; color: "white" | "black" }[];
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
  toC: number
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
  turn: "w" | "b"
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

  socket.on("createRoom", () => {
    const roomId = Math.random().toString(36).substring(2, 7);

    rooms[roomId] = {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w",
      players: [{ id: socket.id, color: "white" }],
    };

    socket.join(roomId);

    socket.emit("roomCreated", {
      roomId,
      color: "white",
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

    socket.join(roomId);

    socket.emit("roomJoined", {
      roomId,
      color: "black",
      fen: room.fen,
    });

    io.to(roomId).emit("playersReady");
  });

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
      console.log(
        "Movimento rejeitado: não segue as regras de xadrez",
      );
      socket.emit("errorMessage", "Movimento inválido - não segue as regras de xadrez");
      return;
    }

    room.fen = fen;
    io.to(roomId).emit("move", fen);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("♟️ Multiplayer server running on port 4000");
});