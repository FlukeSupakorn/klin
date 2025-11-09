import { create } from 'zustand'

export type ViewMode = 'grid' | 'list'

interface FileStore {
  selectedFileIds: Set<string>
  selectFile: (id: string) => void
  deselectFile: (id: string) => void
  toggleFileSelection: (id: string) => void
  selectAllFiles: (ids: string[]) => void
  deselectAllFiles: () => void
  isFileSelected: (id: string) => boolean
  
  // View mode
  currentView: ViewMode
  setCurrentView: (view: ViewMode) => void
  
  // Secret files (for history page)
  secretFiles: any[]
}

export const useFileStore = create<FileStore>((set, get) => ({
  selectedFileIds: new Set(),

  selectFile: (id) =>
    set((state) => ({
      selectedFileIds: new Set([...state.selectedFileIds, id]),
    })),

  deselectFile: (id) =>
    set((state) => {
      const newSet = new Set(state.selectedFileIds)
      newSet.delete(id)
      return { selectedFileIds: newSet }
    }),

  toggleFileSelection: (id) => {
    const isSelected = get().selectedFileIds.has(id)
    if (isSelected) {
      get().deselectFile(id)
    } else {
      get().selectFile(id)
    }
  },

  selectAllFiles: (ids) =>
    set({
      selectedFileIds: new Set(ids),
    }),

  deselectAllFiles: () =>
    set({
      selectedFileIds: new Set(),
    }),

  isFileSelected: (id) => get().selectedFileIds.has(id),
  
  // View mode
  currentView: 'grid',
  setCurrentView: (view) => set({ currentView: view }),
  
  // Secret files
  secretFiles: [],
}))

