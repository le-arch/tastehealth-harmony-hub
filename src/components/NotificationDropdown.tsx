
"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Bell, Check, CheckCheck, ExternalLink } from "lucide-react"
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile"
import "./NotificationDropdown.css"

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "Water Reminder",
      message: "Don't forget to drink water! You're 2 cups behind your goal.",
      time: "Just now",
      type: "water",
      isRead: false,
    },
    {
      id: 2,
      title: "New Badge Earned",
      message: "Congratulations! You've earned the 'Protein Champion' badge.",
      time: "2 hours ago",
      type: "achievement",
      isRead: false,
    },
    {
      id: 3,
      title: "Meal Plan Updated",
      message: "Your meal plan for the week has been updated.",
      time: "Yesterday",
      type: "meal",
      isRead: false,
    },
  ]

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

  const markAsRead = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    // Mark notification as read logic
    setUnreadCount((prev) => Math.max(prev - 1, 0))
  }

  const markAllAsRead = () => {
    // Mark all notifications as read logic
    setUnreadCount(0)
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
        <div 
          className={`absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700 ${
            isMobile ? 'w-[calc(100vw-32px)] left-[50%] -translate-x-1/2' : 
            isTablet ? 'w-[350px]' : 'w-80'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-sm text-green-600 hover:text-green-700 flex items-center">
                <CheckCheck className="h-4 w-4 mr-1" />
                Mark all as read
              </button>
            )}
          </div>

          <div className={`overflow-y-auto ${isMobile ? 'max-h-[50vh]' : 'max-h-[300px]'}`}>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b border-gray-200 dark:border-gray-700 flex items-start gap-3 ${
                    notification.isRead ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{notification.title}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                  </div>
                  {!notification.isRead && (
                    <button
                      className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      onClick={(e) => markAsRead(notification.id, e)}
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
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
