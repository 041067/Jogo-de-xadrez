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
      return;
    }

    // Valida se é a vez do jogador
    const currentTurn = room.fen.split(" ")[1]; // "w" ou "b"
    const playerColor = player.color === "white" ? "w" : "b";

    if (currentTurn !== playerColor) {
      console.log(
        `Movimento rejeitado: não é a vez de ${player.color}. Turno atual: ${currentTurn}`,
      );
      socket.emit("errorMessage", "Não é a sua vez");
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