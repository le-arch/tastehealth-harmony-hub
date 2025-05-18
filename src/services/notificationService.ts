import { supabase } from "@/integrations/supabase/client"

export type NotificationType = "meal" | "water" | "exercise" | "sleep" | "achievement" | "system"

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  created_at: string
}

/**
 * Get all notifications for the current user
 */
export const getNotifications = async (limit = 10): Promise<Notification[]> => {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id

    if (!userId) {
      return []
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching notifications:", error)
      return []
    }

    return data as Notification[]
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

/**
 * Get unread notification count for the current user
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id

    if (!userId) {
      return 0
    }

    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) {
      console.error("Error fetching unread notification count:", error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error("Error fetching unread notification count:", error)
    return 0
  }
}

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id

    if (!userId) {
      return false
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId)
      .eq("user_id", userId)

    if (error) {
      console.error("Error marking notification as read:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return false
  }
}

/**
 * Mark all notifications as read for the current user
 */
export const markAllNotificationsAsRead = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id

    if (!userId) {
      return false
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false)

    if (error) {
      console.error("Error marking all notifications as read:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return false
  }
}

/**
 * Create a new notification
 */
export const createNotification = async (
  title: string,
  message: string,
  type: NotificationType,
): Promise<Notification | null> => {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id

    if (!userId) {
      return null
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        type,
        is_read: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating notification:", error)
      return null
    }

    return data as Notification
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id

    if (!userId) {
      return false
    }

    const { error } = await supabase.from("notifications").delete().eq("id", notificationId).eq("user_id", userId)

    if (error) {
      console.error("Error deleting notification:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting notification:", error)
    return false
  }
}

/**
 * Delete all notifications for the current user
 */
export const deleteAllNotifications = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session.session?.user.id

    if (!userId) {
      return false
    }

    const { error } = await supabase.from("notifications").delete().eq("user_id", userId)

    if (error) {
      console.error("Error deleting all notifications:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error deleting all notifications:", error)
    return false
  }
}
