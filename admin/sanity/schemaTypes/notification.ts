// /sanity/schemas/notification.ts
import { defineType } from "sanity";

export default defineType({
  name: "notification",
  title: "Notifications",
  type: "document",
  fields: [
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["success", "error", "warning", "info"],
      },
    },
    {
      name: "message",
      title: "Message",
      type: "text",
    },
    {
      name: "source",
      title: "Source",
      type: "string",
    },
    {
      name: "read",
      title: "Read",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
    },
  ],
  orderings: [
    {
      title: "Newest first",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
  ],
});
