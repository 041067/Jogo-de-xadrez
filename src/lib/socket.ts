import { io } from "socket.io-client";

console.log("SOCKET URL:", process.env.NEXT_PUBLIC_SOCKET_URL);

export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL!,
    {
    transports: ["websocket"],
    }
);


socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket error:", err);
});
