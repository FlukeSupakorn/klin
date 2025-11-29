import { useState } from 'react'
import { Notification } from '@/components/NotificationPanel'

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Duplicate Files Found',
    message: '15 duplicate files detected in your watched folders, wasting 12.4 MB of storage',
    timestamp: new Date(),
    actionPath: '/file-health',
    actionLabel: 'View Details'
  }
]

export function useNotifications() {
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS)

  const toggleNotificationPanel = () => {
    setIsNotificationPanelOpen(prev => !prev)
  }

  const closeNotificationPanel = () => {
    setIsNotificationPanelOpen(false)
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  return {
    isNotificationPanelOpen,
    notifications,
    notificationCount: notifications.length,
    toggleNotificationPanel,
    closeNotificationPanel,
    clearNotification,
    clearAllNotifications,
    addNotification,
  }
}
