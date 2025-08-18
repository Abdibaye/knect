"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { BellIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type Notification = {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  postId?: string;
  commentId?: string;
}

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  )
}

export default function NotificationMenu() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length
  const router = useRouter()

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        setNotifications(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleNotificationClick = async (n: Notification) => {
    // Optimistically mark as read in UI
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))
    try {
      // Mark all as read on server (no single-notification endpoint exists)
      await fetch("/api/notifications", { method: "PATCH" })
    } catch {
      // ignore
    }
    const path = n.postId ? `/posts/${n.postId}${n.commentId ? `#comment-${n.commentId}` : ""}` : "/notifications"
    router.push(path)
  }

  const handleMarkAllAsRead = async () => {
    await fetch("/api/notifications", { method: "PATCH" })
    fetchNotifications()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground relative size-8 rounded-full shadow-none"
          aria-label="Open notifications"
        >
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <div
              aria-hidden="true"
              className="bg-primary absolute top-0.5 right-0.5 size-1 rounded-full"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="text-xs font-medium hover:underline"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </div>
        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        ></div>
        {loading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">Loading…</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">No notifications</div>
        ) : notifications.map((notification) => (
          <div
            key={notification.id}
            className={`hover:bg-accent rounded-md px-3 py-2 text-sm transition-colors ${!notification.read ? "font-semibold" : ""}`}
          >
            <div className="relative flex items-start pe-3">
              <div className="flex-1 space-y-1">
                <div className="text-foreground/80 text-left">
                  {notification.postId ? (
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="block text-left w-full"
                    >
                      {notification.message}
                    </button>
                  ) : (
                    <div>{notification.message}</div>
                  )}
                </div>
                <div className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </div>
              </div>
              {!notification.read && (
                <div className="absolute end-0 self-center">
                  <span className="sr-only">Unread</span>
                  <Dot />
                </div>
              )}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
