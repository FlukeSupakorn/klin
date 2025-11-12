import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { FileItem } from '@/lib/tauri-api'

export interface WatchingFolder {
  id: string
  name: string
  path: string
  fileCount: number
}

interface OrganizePreview {
  file: FileItem
  currentName: string
  newName: string
  currentFolder: string
  destinationFolder: string
  status: 'pending' | 'approved' | 'rejected'
  summary?: string
}

interface HomeState {
  // Folder Management - Updated for multiple watching folders
  watchingFolders: WatchingFolder[]
  selectedFolderIds: string[] // Empty array means "All" selected
  setWatchingFolders: (folders: WatchingFolder[]) => void
  addWatchingFolder: (folder: WatchingFolder) => void
  removeWatchingFolder: (id: string) => void
  updateWatchingFolder: (id: string, updates: Partial<WatchingFolder>) => void
  setSelectedFolders: (ids: string[]) => void
  toggleFolderSelection: (id: string) => void
  selectAllFolders: () => void
  
  // Legacy support (will be removed)
  watchedFolder: string
  setWatchedFolder: (folder: string) => void
  
  destinationFolders: string[]
  setDestinationFolders: (folders: string[]) => void
  addDestinationFolder: (folder: string) => void
  removeDestinationFolder: (folder: string) => void
  
  // File Management
  files: FileItem[]
  setFiles: (files: FileItem[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  
  // Organize Flow
  organizePreviews: OrganizePreview[]
  setOrganizePreviews: (previews: OrganizePreview[]) => void
  updatePreviewStatus: (index: number, status: 'pending' | 'approved' | 'rejected') => void
  updatePreviewEdit: (index: number, newName: string, destinationFolder: string) => void
  isLoadingOrganize: boolean
  setIsLoadingOrganize: (loading: boolean) => void
  
  // Dialog States
  isOrganizeOpen: boolean
  setIsOrganizeOpen: (open: boolean) => void
  isPreviewOpen: boolean
  setIsPreviewOpen: (open: boolean) => void
  isChangeFolderOpen: boolean
  setIsChangeFolderOpen: (open: boolean) => void
  isManageFoldersOpen: boolean
  setIsManageFoldersOpen: (open: boolean) => void
  
  // First-Time Setup
  isFirstTimeSetup: boolean
  setIsFirstTimeSetup: (setup: boolean) => void
  setupStep: 'welcome' | 'watching' | 'mode-selection' | 'ai-generated' | 'destinations'
  setSetupStep: (step: 'welcome' | 'watching' | 'mode-selection' | 'ai-generated' | 'destinations') => void
  tempWatchingFolders: WatchingFolder[]
  setTempWatchingFolders: (folders: WatchingFolder[]) => void
  addTempWatchingFolder: (folder: WatchingFolder) => void
  removeTempWatchingFolder: (id: string) => void
  tempWatchingFolder: string // Legacy - for backward compatibility
  setTempWatchingFolder: (folder: string) => void
  tempDestinations: string[]
  setTempDestinations: (folders: string[]) => void
  addTempDestination: (folder: string) => void
  removeTempDestination: (folder: string) => void
  destinationMode: 'ai' | 'custom' | null
  setDestinationMode: (mode: 'ai' | 'custom' | null) => void
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
  // Folder Management - Multiple watching folders
  watchingFolders: [],
  selectedFolderIds: [], // Empty = "All" selected
  
  setWatchingFolders: (folders) => set({ watchingFolders: folders }),
  
  addWatchingFolder: (folder) =>
    set((state) => ({
      watchingFolders: [...state.watchingFolders, folder],
    })),
    
  removeWatchingFolder: (id) =>
    set((state) => ({
      watchingFolders: state.watchingFolders.filter((f) => f.id !== id),
      selectedFolderIds: state.selectedFolderIds.filter((fid) => fid !== id),
    })),
    
  updateWatchingFolder: (id, updates) =>
    set((state) => ({
      watchingFolders: state.watchingFolders.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),
    
  setSelectedFolders: (ids) => set({ selectedFolderIds: ids }),
  
  toggleFolderSelection: (id) =>
    set((state) => {
      const isSelected = state.selectedFolderIds.includes(id)
      if (isSelected) {
        // Deselect this folder
        return { selectedFolderIds: state.selectedFolderIds.filter((fid) => fid !== id) }
      } else {
        // Select this folder
        return { selectedFolderIds: [...state.selectedFolderIds, id] }
      }
    }),
    
  selectAllFolders: () => set({ selectedFolderIds: [] }),
  
  // Legacy support
  watchedFolder: '',
  setWatchedFolder: (folder) => set({ watchedFolder: folder }),
  
  destinationFolders: [],
  setDestinationFolders: (folders) => set({ destinationFolders: folders }),
  addDestinationFolder: (folder) =>
    set((state) => ({
      destinationFolders: state.destinationFolders.includes(folder)
        ? state.destinationFolders
        : [...state.destinationFolders, folder],
    })),
  removeDestinationFolder: (folder) =>
    set((state) => ({
      destinationFolders: state.destinationFolders.filter((f) => f !== folder),
    })),
  
  // File Management
  files: [],
  setFiles: (files) => set({ files }),
  loading: true,
  setLoading: (loading) => set({ loading }),
  
  // Organize Flow
  organizePreviews: [],
  setOrganizePreviews: (previews) => set({ organizePreviews: previews }),
  updatePreviewStatus: (index, status) =>
    set((state) => ({
      organizePreviews: state.organizePreviews.map((preview, i) =>
        i === index ? { ...preview, status } : preview
      ),
    })),
  updatePreviewEdit: (index, newName, destinationFolder) =>
    set((state) => ({
      organizePreviews: state.organizePreviews.map((preview, i) =>
        i === index ? { ...preview, newName, destinationFolder } : preview
      ),
    })),
  isLoadingOrganize: false,
  setIsLoadingOrganize: (loading) => set({ isLoadingOrganize: loading }),
  
  // Dialog States
  isOrganizeOpen: false,
  setIsOrganizeOpen: (open) => set({ isOrganizeOpen: open }),
  isPreviewOpen: false,
  setIsPreviewOpen: (open) => set({ isPreviewOpen: open }),
  isChangeFolderOpen: false,
  setIsChangeFolderOpen: (open) => set({ isChangeFolderOpen: open }),
  isManageFoldersOpen: false,
  setIsManageFoldersOpen: (open) => set({ isManageFoldersOpen: open }),
  
  // First-Time Setup
  isFirstTimeSetup: false,
  setIsFirstTimeSetup: (setup) => set({ isFirstTimeSetup: setup }),
  setupStep: 'welcome',
  setSetupStep: (step) => set({ setupStep: step }),
  tempWatchingFolders: [],
  setTempWatchingFolders: (folders) => set({ tempWatchingFolders: folders }),
  addTempWatchingFolder: (folder) =>
    set((state) => {
      // Prevent duplicates by checking if path already exists
      const exists = state.tempWatchingFolders.some(f => f.path === folder.path)
      if (exists) return state
      return { tempWatchingFolders: [...state.tempWatchingFolders, folder] }
    }),
  removeTempWatchingFolder: (id) =>
    set((state) => ({
      tempWatchingFolders: state.tempWatchingFolders.filter((f) => f.id !== id),
    })),
  tempWatchingFolder: '', // Legacy
  setTempWatchingFolder: (folder) => set({ tempWatchingFolder: folder }),
  tempDestinations: [],
  setTempDestinations: (folders) => set({ tempDestinations: folders }),
  addTempDestination: (folder) =>
    set((state) => ({
      tempDestinations: state.tempDestinations.includes(folder)
        ? state.tempDestinations
        : [...state.tempDestinations, folder],
    })),
  removeTempDestination: (folder) =>
    set((state) => ({
      tempDestinations: state.tempDestinations.filter((f) => f !== folder),
    })),
  destinationMode: null,
  setDestinationMode: (mode) => set({ destinationMode: mode }),
    }),
    {
      name: 'klin-home-storage',
      partialize: (state) => ({
        watchingFolders: state.watchingFolders,
        destinationFolders: state.destinationFolders,
        destinationMode: state.destinationMode,
      }),
    }
  )
)
