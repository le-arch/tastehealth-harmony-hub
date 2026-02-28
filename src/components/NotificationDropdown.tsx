"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Bell, Check, CheckCheck, ExternalLink, Trash2 } from "lucide-react"
import { useNotifications } from "@/contexts/NotificationContext"
import "./NotificationDropdown.css"

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    markAsRead(id)
  }

  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "meal":
        return <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
      case "water":
        return <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
      case "achievement":
        return <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
      default:
        return <span className="inline-block w-2 h-2 bg-gray-500 rounded-full"></span>
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bottom-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-sm text-green-600 hover:text-green-700 flex items-center">
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
            ) : (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-200 dark:border-gray-700 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    notification.isRead ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{notification.title}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{getTimeAgo(notification.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                  </div>
                  <div className="flex gap-1">
                    {!notification.isRead && (
                      <button
                        className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                      title="Delete notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/notifications"
              className="block w-full py-2 text-center text-sm font-medium text-green-600 hover:text-green-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md flex items-center justify-center"
              onClick={() => setIsOpen(false)}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
