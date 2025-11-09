import { create } from 'zustand'
import { FileItem } from '@/lib/tauri-api'

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
  // Folder Management
  watchedFolder: string
  destinationFolders: string[]
  setWatchedFolder: (folder: string) => void
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
  tempWatchingFolder: string
  setTempWatchingFolder: (folder: string) => void
  tempDestinations: string[]
  setTempDestinations: (folders: string[]) => void
  addTempDestination: (folder: string) => void
  removeTempDestination: (folder: string) => void
  destinationMode: 'ai' | 'custom' | null
  setDestinationMode: (mode: 'ai' | 'custom' | null) => void
}

export const useHomeStore = create<HomeState>((set) => ({
  // Folder Management
  watchedFolder: '',
  destinationFolders: [],
  setWatchedFolder: (folder) => set({ watchedFolder: folder }),
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
  tempWatchingFolder: '',
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
}))
