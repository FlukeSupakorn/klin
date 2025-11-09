import { create } from 'zustand'
import { OrganizeFileResponse } from '@/lib/mock-api'

export interface ActivityItem extends OrganizeFileResponse {
  id: string
  timestamp: Date
  editedName?: string
  editedFolder?: string
  userAction?: 'approved' | 'rejected' | 'pending'
}

export interface HistoryItem {
  id: string
  file_path: string
  original_name: string
  final_name: string
  original_folder: string
  final_folder: string
  action: 'approved' | 'rejected'
  timestamp: Date
}

interface ActivityState {
  // Current queue of files being processed
  queue: ActivityItem[]
  // Processing state
  isProcessing: boolean
  currentIndex: number
  totalFiles: number
  // History of completed actions
  history: HistoryItem[]
  
  // Actions
  addToQueue: (item: ActivityItem) => void
  updateQueueItem: (id: string, updates: Partial<ActivityItem>) => void
  removeFromQueue: (id: string) => void
  clearQueue: () => void
  setProcessing: (isProcessing: boolean) => void
  setProgress: (current: number, total: number) => void
  
  // User actions
  approveItem: (id: string) => void
  rejectItem: (id: string) => void
  approveAll: () => void
  rejectAll: () => void
  editItemName: (id: string, newName: string) => void
  editItemFolder: (id: string, newFolder: string) => void
  
  // Move to history
  moveToHistory: (item: ActivityItem) => void
  clearHistory: () => void
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  queue: [],
  isProcessing: false,
  currentIndex: 0,
  totalFiles: 0,
  history: [],

  addToQueue: (item) =>
    set((state) => ({
      queue: [...state.queue, item],
    })),

  updateQueueItem: (id, updates) =>
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  removeFromQueue: (id) =>
    set((state) => ({
      queue: state.queue.filter((item) => item.id !== id),
    })),

  clearQueue: () =>
    set({
      queue: [],
      isProcessing: false,
      currentIndex: 0,
      totalFiles: 0,
    }),

  setProcessing: (isProcessing) => set({ isProcessing }),

  setProgress: (current, total) =>
    set({
      currentIndex: current,
      totalFiles: total,
    }),

  approveItem: (id) => {
    const item = get().queue.find((i) => i.id === id)
    if (item) {
      get().updateQueueItem(id, { userAction: 'approved', status: 'approved' })
      
      // Move to history after a short delay
      setTimeout(() => {
        get().moveToHistory(get().queue.find((i) => i.id === id)!)
        get().removeFromQueue(id)
      }, 500)
    }
  },

  rejectItem: (id) => {
    const item = get().queue.find((i) => i.id === id)
    if (item) {
      get().updateQueueItem(id, { userAction: 'rejected', status: 'rejected' })
      
      // Move to history after a short delay
      setTimeout(() => {
        get().moveToHistory(get().queue.find((i) => i.id === id)!)
        get().removeFromQueue(id)
      }, 500)
    }
  },

  approveAll: () => {
    const completedItems = get().queue.filter((item) => item.status === 'completed')
    completedItems.forEach((item) => {
      get().approveItem(item.id)
    })
  },

  rejectAll: () => {
    const completedItems = get().queue.filter((item) => item.status === 'completed')
    completedItems.forEach((item) => {
      get().rejectItem(item.id)
    })
  },

  editItemName: (id, newName) =>
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id ? { ...item, editedName: newName } : item
      ),
    })),

  editItemFolder: (id, newFolder) =>
    set((state) => ({
      queue: state.queue.map((item) =>
        item.id === id ? { ...item, editedFolder: newFolder } : item
      ),
    })),

  moveToHistory: (item) => {
    if (!item) return

    const historyItem: HistoryItem = {
      id: item.id,
      file_path: item.file_path,
      original_name: item.original_name,
      final_name: item.editedName || item.suggested_name,
      original_folder: item.original_folder,
      final_folder: item.editedFolder || item.suggested_folder,
      action: (item.userAction === 'approved' || item.userAction === 'rejected') 
        ? item.userAction 
        : 'approved',
      timestamp: item.timestamp,
    }

    set((state) => ({
      history: [historyItem, ...state.history],
    }))
  },

  clearHistory: () => set({ history: [] }),
}))
