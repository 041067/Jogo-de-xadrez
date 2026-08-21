import { io } from "socket.io-client";

export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL!,
  {
    transports: ["websocket"],
    // Evita abrir um socket enquanto o Next gera as páginas estáticas.
    autoConnect: typeof window !== "undefined",
  },
);
