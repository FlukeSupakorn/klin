import { create } from 'zustand'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

// ============================================================================
// Types & Store
// ============================================================================

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number // in milliseconds, 0 = permanent until dismissed
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

const generateId = () => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateId()
    const newToast: Toast = {
      id,
      ...toast,
      duration: toast.duration !== undefined ? toast.duration : 2000, // Default 2 seconds if not provided
    }

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    return id
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearAll: () => set({ toasts: [] }),
}))


export function useToast() {
  const addToast = useToastStore((state) => state.addToast)

  const show = (
    type: ToastType,
    title: string,
    message?: string,
    duration?: number
  ) => {
    addToast({
      type,
      title,
      message,
      duration,
    })
  }

  return {
    success: (title: string, message?: string, duration?: number) => 
      show('success', title, message, duration),
    
    error: (title: string, message?: string, duration?: number) => 
      show('error', title, message, duration),
    
    info: (title: string, message?: string, duration?: number) => 
      show('info', title, message, duration),
    
    warning: (title: string, message?: string, duration?: number) => 
      show('warning', title, message, duration),
    
    // Generic show method
    show,
  }
}

// ============================================================================
// Components
// ============================================================================

const toastStyles: Record<ToastType, { bg: string; border: string; icon: any; iconColor: string }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
  },
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((state) => state.removeToast)
  const style = toastStyles[toast.type]
  const Icon = style.icon
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Auto-dismiss after duration
    if (toast.duration && toast.duration > 0) {
      const fadeTimer = setTimeout(() => {
        setIsExiting(true)
      }, toast.duration)

      return () => clearTimeout(fadeTimer)
    }
  }, [toast.duration])

  // Remove from store after animation completes
  useEffect(() => {
    if (isExiting) {
      const removeTimer = setTimeout(() => {
        removeToast(toast.id)
      }, 300) // Match animation duration

      return () => clearTimeout(removeTimer)
    }
  }, [isExiting, toast.id, removeToast])

  const handleDismiss = () => {
    setIsExiting(true)
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border-2 shadow-lg min-w-[320px] max-w-[420px]',
        'transition-all duration-300 ease-in-out',
        isExiting 
          ? 'opacity-0 translate-x-full' 
          : 'opacity-100 translate-x-0 animate-in slide-in-from-right',
        style.bg,
        style.border
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', style.iconColor)} />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 mb-1">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-sm text-slate-600">
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts)

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </div>
  )
}
