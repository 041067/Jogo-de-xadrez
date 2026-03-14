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
  players: string[];
};

const rooms: Record<string, Room> = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("createRoom", () => {
    const roomId = Math.random().toString(36).substring(2, 7);

    rooms[roomId] = {
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w",
      players: [socket.id],
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

    room.players.push(socket.id);

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

    room.fen = fen;

    socket.to(roomId).emit("move", fen);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("♟️ Multiplayer server running on port 4000");
});