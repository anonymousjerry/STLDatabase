//sanity/plugins/socketListener.ts
import { io, Socket } from "socket.io-client";

interface ScrapSuccessPayload {
    status: 'success' | 'error' | 'info' | 'warning'
    message: string;
    source: string;
}

interface ScrapeSummaryPayload {
    status: 'success' | 'error' | 'info' | 'warning'
    message: string;
    source: string;
    success_count: number;
    failure_count: number;
}

type NotifyFn = (status: string, msg: string) => void;

const SOCKET_URL = "http://15.204.213.3:8080"; // replace with your backend socket server

let socket: Socket | null = null;

export const setupSocketListeners = (notify: NotifyFn) => {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ["websocket"] });
  }

  socket.on("connect", () => {
    console.log("Connected to socket:", socket?.id);
  });

  socket.on("scrap_success", (data: ScrapSuccessPayload) => {
    console.log("Scrap Success:", data);
    notify(data.status, data.message);
  });

  socket.on("scrape_summary", (data: ScrapeSummaryPayload) => {
    console.log("Scrape Summary:", data);
    notify(data.status, data.message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket");
  });
};