import { io, Socket } from "socket.io-client";

interface ScrapSuccessPayload {
    status: 'success' | 'error' | 'info' | 'warning'
    message: string;
    source: string;
}

interface ScrapStatusPayload {
    id: string;
    status: string;
    platform: string;
}

interface ScrapeSummaryPayload {
    status: 'success' | 'error' | 'info' | 'warning'
    message: string;
    source: string;
    success_count: number;
    failure_count: number;
}

type NotifyFn = (status: string, msg: string) => void;
type StatusUpdateFn = (id: string, status: string, platform: string) => void;

const SOCKET_URL = "http://15.204.213.3:8080"; // replace with your backend socket server

let socket: Socket | null = null;

export const setupSocketListeners = (notify: NotifyFn, statusUpdate?: StatusUpdateFn) => {
  if (!socket) {
    socket = io(SOCKET_URL, { transports: ["websocket"] });
  }

  socket.on("connect", () => {
    console.log("✅ Connected to socket:", socket?.id);
  });

  socket.on("scrape_success", (data: ScrapSuccessPayload) => {
    console.log("Scrap Success:", data);
    notify(data.status, data.message);
  });

  socket.on("scrape_summary", (data: ScrapeSummaryPayload) => {
    console.log("Scrape Summary:", data);
    notify(data.status, data.message);
  });

  socket.on("scrape_status", (data: ScrapStatusPayload) => {
    console.log("Scraping Status Update:", data);
    if (statusUpdate) {
      statusUpdate(data.id, data.status, data.platform);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected from socket");
  });
};