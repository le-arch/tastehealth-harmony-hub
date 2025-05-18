"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Check, CheckCheck, ExternalLink, RefreshCw } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification,
} from "@/services/notificationService"
import { toast } from "sonner"

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { language } = useLanguage()

  // Translations
  const translations = {
    en: {
      notifications: "Notifications",
      noNotifications: "No notifications",
      markAllRead: "Mark all as read",
      viewAll: "View all notifications",
      justNow: "Just now",
      minutesAgo: "min ago",
      hourAgo: "hour ago",
      hoursAgo: "hours ago",
      dayAgo: "day ago",
      daysAgo: "days ago",
      refreshNotifications: "Refresh notifications",
    },
    fr: {
      notifications: "Notifications",
      noNotifications: "Notifications",
      noNotifications: "Aucune notification",
      markAllRead: "Tout marquer comme lu",
      viewAll: "Voir toutes les notifications",
      justNow: "À l'instant",
      minutesAgo: "min",
      hourAgo: "heure",
      hoursAgo: "heures",
      dayAgo: "jour",
      daysAgo: "jours",
      refreshNotifications: "Actualiser les notifications",
    },
  }

  const t = translations[language as keyof typeof translations] || translations.en

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  useEffect(() => {
    loadUnreadCount()

    // Set up interval to check for new notifications
    const interval = setInterval(() => {
      loadUnreadCount()
      if (isOpen) {
        loadNotifications()
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [isOpen])

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const data = await getNotifications(5) // Get 5 most recent notifications
      setNotifications(data)
      await loadUnreadCount()
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadNotificationCount()
      setUnreadCount(count)
    } catch (error) {
      console.error("Error loading unread count:", error)
    }
  }

  const handleMarkAsRead = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      await markNotificationAsRead(id)
      setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
      await loadUnreadCount()
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const handleRefresh = async () => {
    await loadNotifications()
    toast.success(language === "en" ? "Notifications refreshed" : "Notifications actualisées")
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return t.justNow
    if (diffMinutes < 60) return `${diffMinutes} ${t.minutesAgo}`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours === 1) return `1 ${t.hourAgo}`
    if (diffHours < 24) return `${diffHours} ${t.hoursAgo}`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return `1 ${t.dayAgo}`
    return `${diffDays} ${t.daysAgo}`
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "meal":
        return (
          <span role="img" aria-label="meal" className="text-orange-500">
            🍽️
          </span>
        )
      case "water":
        return (
          <span role="img" aria-label="water" className="text-blue-500">
            💧
          </span>
        )
      case "exercise":
        return (
          <span role="img" aria-label="exercise" className="text-green-500">
            🏋️
          </span>
        )
      case "sleep":
        return (
          <span role="img" aria-label="sleep" className="text-purple-500">
            😴
          </span>
        )
      case "achievement":
        return (
          <span role="img" aria-label="achievement" className="text-yellow-500">
            🏆
          </span>
        )
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center bg-red-500 text-white"
              variant="destructive"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" side="top">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">{t.notifications}</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleRefresh} title={t.refreshNotifications}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-1" />
                {t.markAllRead}
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">{t.noNotifications}</div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-3 border-b flex items-start gap-3 ${
                    notification.is_read ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"
                  }`}
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <span className="text-xs text-gray-500">{formatTimeAgo(notification.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                  </div>
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="p-2 border-t">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link to="/notifications" onClick={() => setIsOpen(false)}>
              <ExternalLink className="h-4 w-4 mr-1" />
              {t.viewAll}
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NotificationDropdown
