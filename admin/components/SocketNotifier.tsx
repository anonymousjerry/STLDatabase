// components/SocketNotifier.tsx
import { useEffect } from "react";
import { useToast } from "@sanity/ui";
import { setupSocketListeners } from "../sanity/plugins/socketListener";
import { useClient } from "sanity"; // ✅ built-in hook

export default function SocketNotifier() {
  const toast = useToast();
  const client = useClient({ apiVersion: "2025-08-01" }); // use today’s date

  useEffect(() => {
    setupSocketListeners(async (status, message) => {
      console.log("📡 Socket Event:", status, message);

      // Show toast
      toast.push({
        status: (["success", "error", "warning", "info"].includes(status) ? status : "info") as
          | "success"
          | "error"
          | "warning"
          | "info",
        title: message,
      });

      // Save notification in Sanity
      await client.create({
        _type: "notification",
        status,
        message,
        source: "scraper",
        read: false,
        createdAt: new Date().toISOString(),
      });
    });
  }, [toast, client]);

  return null;
}
