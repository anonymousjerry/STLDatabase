"use client"

import { useState, useEffect } from "react"
import { Card, Text, Button, Stack, Badge, Inline, Flex } from "@sanity/ui"
import { BellIcon } from "@sanity/icons"

interface Notification {
  id: string
  message: string
  status: "success" | "error" | "warning" | "info"
  createdAt: string
  read: boolean
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const stored = localStorage.getItem("sanity-notifications")
    if (stored) setNotifications(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem("sanity-notifications", JSON.stringify(notifications))
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const clearAll = () => setNotifications([])

  const filtered = filter === "all"
    ? notifications
    : notifications.filter((n) =>
        filter === "unread" ? !n.read : n.status === filter
      )

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={4}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text size={2} weight="semibold">
            <BellIcon /> Notification Center
          </Text>
          <Button
            tone="critical"
            text="Clear All"
            mode="ghost"
            onClick={clearAll}
          />
        </Flex>

        {/* Filter Buttons */}
        <Inline space={2}>
          {["all", "unread", "success", "error", "warning", "info"].map((f) => (
            <Button
              key={f}
              mode={filter === f ? "default" : "ghost"}
              text={f.toUpperCase()}
              onClick={() => setFilter(f)}
            />
          ))}
        </Inline>

        {/* Notifications List */}
        <Stack space={3}>
          {filtered.length === 0 && (
            <Text size={1} muted>
              No notifications found.
            </Text>
          )}
          {filtered.map((n) => (
            <Card
              key={n.id}
              padding={3}
              radius={2}
              shadow={1}
              tone={n.read ? "transparent" : "primary"}
            >
              <Stack space={2}>
                <Flex justify="space-between" align="center">
                  <Badge tone={n.read ? "default" : "primary"}>
                    {n.status.toUpperCase()}
                  </Badge>
                  <Text size={1} muted>
                    {new Date(n.createdAt).toLocaleString()}
                  </Text>
                </Flex>

                <Text>{n.message}</Text>

                {!n.read && (
                  <Button
                    text="Mark as read"
                    tone="primary"
                    mode="ghost"
                    onClick={() => markAsRead(n.id)}
                  />
                )}
              </Stack>
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}
