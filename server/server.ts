import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

type Room = {
  players: string[];
  fen: string;
};

const rooms: Record<string, Room> = {};

const INITIAL_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1";

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Criar sala
  socket.on("create-room", (roomId: string) => {
    if (rooms[roomId]) {
      socket.emit("error", "Sala já existe");
      return;
    }

    rooms[roomId] = {
      players: [socket.id],
      fen: INITIAL_FEN,
    };

    socket.join(roomId);

    socket.emit("room-created", {
      roomId,
      color: "white",
      fen: INITIAL_FEN,
    });

    console.log("Room created:", roomId);
  });

  // Entrar em sala
  socket.on("join-room", (roomId: string) => {
    const room = rooms[roomId];

    if (!room) {
      socket.emit("error", "Sala não existe");
      return;
    }

    if (room.players.length >= 2) {
      socket.emit("error", "Sala cheia");
      return;
    }

    room.players.push(socket.id);
    socket.join(roomId);

    socket.emit("room-joined", {
      roomId,
      color: "black",
      fen: room.fen,
    });

    socket.to(roomId).emit("player-joined");

    console.log("Player joined room:", roomId);
  });

  // Movimento
  socket.on(
    "move",
    ({ roomId, fen }: { roomId: string; fen: string }) => {
      const room = rooms[roomId];

      if (!room) return;

      room.fen = fen;

      socket.to(roomId).emit("move", fen);
    }
  );

  // Desconexão
  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);

    for (const roomId in rooms) {
      const room = rooms[roomId];

      room.players = room.players.filter(
        (id) => id !== socket.id
      );

      if (room.players.length === 0) {
        delete rooms[roomId];
        console.log("Room removed:", roomId);
      }
    }
  });
});

httpServer.listen(4000, () => {
  console.log("♟️ Multiplayer server running on port 4000");
});