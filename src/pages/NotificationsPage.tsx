"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ProfileSidebar } from "@/components/profile/ProfileSidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useLanguage } from "@/contexts/LanguageContext"
import { Bell, Clock, Utensils, Droplets, Dumbbell, Moon, Award, RefreshCw, Trash2 } from "lucide-react"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
  type Notification,
} from "@/services/notificationService"
import { useScreenSize } from "@/utils/mobile";

const NotificationsPage = () => {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const { isMobile, isTablet } = useScreenSize();
  const translations = {
    en: {
      title: "Notifications",
      subTitle: "Manage your notifications and alerts",
      markAllRead: "Mark all as read",
      clearAll: "Clear all",
      noNotifications: "No notifications to display",
      markAsRead: "Mark as read",
      delete: "Delete",
      refresh: "Refresh",
      filterAll: "All",
      filterUnread: "Unread",
      filterMeal: "Meal",
      filterWater: "Water",
      filterExercise: "Exercise",
      filterSleep: "Sleep",
      filterAchievement: "Achievement",
      filterSystem: "System",
    },
    fr: {
      title: "Notifications",
      subTitle: "Gérez vos notifications et alertes",
      markAllRead: "Tout marquer comme lu",
      clearAll: "Tout effacer",
      noNotifications: "Aucune notification à afficher",
      markAsRead: "Marquer comme lu",
      delete: "Supprimer",
      refresh: "Actualiser",
      filterAll: "Tous",
      filterUnread: "Non lus",
      filterMeal: "Repas",
      filterWater: "Eau",
      filterExercise: "Exercice",
      filterSleep: "Sommeil",
      filterAchievement: "Réussite",
      filterSystem: "Système",
    },
  }

  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    loadNotifications()
  }, [activeFilter])

  useEffect(() => {
    // Set up interval to check for new notifications every 30 seconds
    const interval = setInterval(() => {
      loadNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [activeFilter])

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const data = await getNotifications(100) // Get up to 100 notifications

      // Apply filters if needed
      let filteredData = [...data]

      if (activeFilter === "unread") {
        filteredData = filteredData.filter((n) => !n.is_read)
      } else if (activeFilter && activeFilter !== "all") {
        filteredData = filteredData.filter((n) => n.type === activeFilter)
      }

      setNotifications(filteredData)
    } catch (error) {
      console.error("Error loading notifications:", error)
      toast.error(language === "en" ? "Failed to load notifications" : "Échec du chargement des notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const success = await markNotificationAsRead(id)
      if (success) {
        setNotifications(notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
        toast.success(language === "en" ? "Notification marked as read" : "Notification marquée comme lue")
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error(
        language === "en" ? "Failed to mark notification as read" : "Échec du marquage de la notification comme lue",
      )
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const success = await markAllNotificationsAsRead()
      if (success) {
        setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
        toast.success(
          language === "en" ? "All notifications marked as read" : "Toutes les notifications marquées comme lues",
        )
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error(
        language === "en"
          ? "Failed to mark all notifications as read"
          : "Échec du marquage de toutes les notifications comme lues",
      )
    }
  }

  const handleDeleteNotification = async (id: string) => {
    try {
      const success = await deleteNotification(id)
      if (success) {
        setNotifications(notifications.filter((n) => n.id !== id))
        toast.success(language === "en" ? "Notification deleted" : "Notification supprimée")
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error(language === "en" ? "Failed to delete notification" : "Échec de la suppression de la notification")
    }
  }

  const handleClearAllNotifications = async () => {
    try {
      const success = await deleteAllNotifications()
      if (success) {
        setNotifications([])
        toast.success(language === "en" ? "All notifications cleared" : "Toutes les notifications effacées")
      }
    } catch (error) {
      console.error("Error clearing all notifications:", error)
      toast.error(language === "en" ? "Failed to clear notifications" : "Échec de l'effacement des notifications")
    }
  }

  const handleRefresh = () => {
    loadNotifications()
    toast.success(language === "en" ? "Notifications refreshed" : "Notifications actualisées")
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffMinutes < 60) {
      return language === "en" ? `${diffMinutes} min ago` : `il y a ${diffMinutes} min`
    } else if (diffMinutes < 24 * 60) {
      const hours = Math.floor(diffMinutes / 60)
      return language === "en"
        ? `${hours} hour${hours > 1 ? "s" : ""} ago`
        : `il y a ${hours} heure${hours > 1 ? "s" : ""}`
    } else {
      const days = Math.floor(diffMinutes / (24 * 60))
      return language === "en" ? `${days} day${days > 1 ? "s" : ""} ago` : `il y a ${days} jour${days > 1 ? "s" : ""}`
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "meal":
        return <Utensils className="h-5 w-5 text-orange-500" />
      case "water":
        return <Droplets className="h-5 w-5 text-blue-500" />
      case "exercise":
        return <Dumbbell className="h-5 w-5 text-green-500" />
      case "sleep":
        return <Moon className="h-5 w-5 text-purple-500" />
      case "achievement":
        return <Award className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="flex space-y-6 bg-gray-50 dark:bg-gray-900">
      <ProfileSidebar activePage="notifications" />

      <div className={`flex-1 p-4 sm:p-6 md:p-8 ${isMobile ? "" : "md:ml-64"}`}>
        <div className="grid">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">{t.subTitle}</p>
            </div>

            <div className="flex-1 space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} title={t.refresh}>
                <RefreshCw className="h-4 w-4 mr-1" />
                {t.refresh}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={notifications.every((n) => n.is_read) || notifications.length === 0}
              >
                {t.markAllRead}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAllNotifications}
                disabled={notifications.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {t.clearAll}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter("all")}
              className={activeFilter === "all" || activeFilter === null ? "bg-primary text-primary-foreground" : ""}
            >
              {t.filterAll}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter("unread")}
              className={activeFilter === "unread" ? "bg-primary text-primary-foreground" : ""}
            >
              {t.filterUnread}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter("meal")}
              className={activeFilter === "meal" ? "bg-primary text-primary-foreground" : ""}
            >
              <Utensils className="h-4 w-4 mr-1" />
              {t.filterMeal}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter("water")}
              className={activeFilter === "water" ? "bg-primary text-primary-foreground" : ""}
            >
              <Droplets className="h-4 w-4 mr-1" />
              {t.filterWater}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter("exercise")}
              className={activeFilter === "exercise" ? "bg-primary text-primary-foreground" : ""}
            >
              <Dumbbell className="h-4 w-4 mr-1" />
              {t.filterExercise}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter("sleep")}
              className={activeFilter === "sleep" ? "bg-primary text-primary-foreground" : ""}
            >
              <Moon className="h-4 w-4 mr-1" />
              {t.filterSleep}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveFilter("achievement")}
              className={activeFilter === "achievement" ? "bg-primary text-primary-foreground" : ""}
            >
              <Award className="h-4 w-4 mr-1" />
              {t.filterAchievement}
            </Button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="flex justify-center items-center h-40">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </CardContent>
              </Card>
            ) : notifications.length === 0 ? (
              <Card>
                <CardContent className="flex justify-center items-center h-40">
                  <div className="text-center">
                    <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">{t.noNotifications}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all ${notification.is_read ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800 shadow-md"}`}
                >
                  <CardContent className="p-4">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4 mt-1 bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className={`text-lg font-medium ${notification.is_read ? "text-gray-700 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}
                            >
                              {notification.title}
                              {!notification.is_read && (
                                <Badge className="ml-2 bg-blue-500" variant="secondary">
                                  {language === "en" ? "New" : "Nouveau"}
                                </Badge>
                              )}
                            </h3>
                            <p
                              className={`text-sm mt-1 ${notification.is_read ? "text-gray-500 dark:text-gray-400" : "text-gray-700 dark:text-gray-300"}`}
                            >
                              {notification.message}
                            </p>
                          </div>

                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTime(notification.created_at)}
                          </div>
                        </div>

                        <div className="mt-3 flex justify-end space-x-2">
                          {!notification.is_read && (
                            <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                              {t.markAsRead}
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteNotification(notification.id)}>
                            {t.delete}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
