import { X, FileWarning, AlertCircle, Info, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface Notification {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
  actionPath?: string
  actionLabel?: string
}

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onClearNotification: (id: string) => void
  onClearAll: () => void
}

const iconMap = {
  warning: FileWarning,
  error: AlertCircle,
  info: Info,
  success: CheckCircle2,
}

const colorMap = {
  warning: 'text-amber-500 bg-amber-500/10',
  error: 'text-red-500 bg-red-500/10',
  info: 'text-blue-500 bg-blue-500/10',
  success: 'text-green-500 bg-green-500/10',
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onClearNotification,
  onClearAll,
}: NotificationPanelProps) {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleNotificationClick = (notification: Notification) => {
    if (notification.actionPath) {
      navigate(notification.actionPath)
      onClose()
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-16 right-4 w-96 max-h-[600px] bg-theme-background border border-theme rounded-xl shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
          <h3 className="font-semibold text-theme-text">Notifications</h3>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-theme-secondary hover:text-theme-primary transition-colors"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="text-theme-secondary hover:text-theme-text transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="h-16 w-16 rounded-full bg-theme-secondary flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-theme-muted" />
              </div>
              <p className="text-theme-secondary text-center">
                No notifications
              </p>
              <p className="text-xs text-theme-muted text-center mt-1">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-theme">
              {notifications.map((notification) => {
                const Icon = iconMap[notification.type]
                const colorClass = colorMap[notification.type]

                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-theme-secondary/50 transition-colors ${
                      notification.actionPath ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className={`h-8 w-8 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-theme-text text-sm">
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onClearNotification(notification.id)
                            }}
                            className="text-theme-muted hover:text-theme-secondary transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-xs text-theme-secondary mt-1">
                          {notification.message}
                        </p>
                        {notification.actionLabel && (
                          <button className="text-xs text-theme-primary hover:underline mt-2">
                            {notification.actionLabel} →
                          </button>
                        )}
                        <p className="text-xs text-theme-muted mt-2">
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
