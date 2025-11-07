import { create } from 'zustand'
import type { FileItem, FileStats } from '../types/file'

interface FileStore {
  myFiles: FileItem[]
  secretFiles: FileItem[]
  recentFiles: FileItem[]
  selectedFileIds: string[]
  searchQuery: string
  currentView: 'tab' | 'grid' | 'list'
  storageUsed: number
  storageTotal: number
  fileStats: FileStats | null
  
  // Actions
  toggleFileSelection: (fileId: string) => void
  selectAllFiles: () => void
  deselectAllFiles: () => void
  setSearchQuery: (query: string) => void
  setCurrentView: (view: 'tab' | 'grid' | 'list') => void
  deleteFiles: (fileIds: string[]) => void
  setFileStats: (stats: FileStats) => void
}

export const useFileStore = create<FileStore>((set) => ({
  myFiles: [
    {
      id: '1',
      name: 'Images',
      type: 'folder',
      size: 3800000000,
      sizeFormatted: '3.8 GB',
      users: [
        { id: 'u1', name: 'Sarah Chen', avatar: '', initials: 'SC' },
        { id: 'u2', name: 'Mike Johnson', avatar: '', initials: 'MJ' },
        { id: 'u3', name: 'Emma Wilson', avatar: '', initials: 'EW' },
        { id: 'u4', name: 'David Lee', avatar: '', initials: 'DL' },
      ],
      userCount: 7,
      lastModified: new Date('2025-18-16'),
      lastModifiedFormatted: '2025/18/16',
    },
    {
      id: '2',
      name: 'GIFs',
      type: 'folder',
      size: 7200000,
      sizeFormatted: '7.2 MB',
      users: [
        { id: 'u1', name: 'Sarah Chen', avatar: '', initials: 'SC' },
        { id: 'u5', name: 'John Smith', avatar: '', initials: 'JS' },
        { id: 'u6', name: 'Lisa Brown', avatar: '', initials: 'LB' },
        { id: 'u7', name: 'Tom Davis', avatar: '', initials: 'TD' },
        { id: 'u8', name: 'Nina Garcia', avatar: '', initials: 'NG' },
      ],
      userCount: 5,
      lastModified: new Date('2025-18-16'),
      lastModifiedFormatted: '2025/18/16',
    },
    {
      id: '3',
      name: 'Memes',
      type: 'folder',
      size: 881000000,
      sizeFormatted: '881 MB',
      users: [
        { id: 'u2', name: 'Mike Johnson', avatar: '', initials: 'MJ' },
        { id: 'u9', name: 'Alex Kim', avatar: '', initials: 'AK' },
      ],
      userCount: 5,
      lastModified: new Date('2025-18-16'),
      lastModifiedFormatted: '2025/18/16',
    },
    {
      id: '4',
      name: 'Videos',
      type: 'folder',
      size: 1250000000,
      sizeFormatted: '1.25 GB',
      users: [
        { id: 'u3', name: 'Emma Wilson', avatar: '', initials: 'EW' },
        { id: 'u4', name: 'David Lee', avatar: '', initials: 'DL' },
        { id: 'u10', name: 'Chris Taylor', avatar: '', initials: 'CT' },
        { id: 'u11', name: 'Julia Martinez', avatar: '', initials: 'JM' },
      ],
      userCount: 7,
      lastModified: new Date('2025-18-16'),
      lastModifiedFormatted: '2025/18/16',
    },
    {
      id: '5',
      name: 'Documents',
      type: 'folder',
      size: 1200000000000,
      sizeFormatted: '1.2 TB',
      users: [
        { id: 'u1', name: 'Sarah Chen', avatar: '', initials: 'SC' },
        { id: 'u5', name: 'John Smith', avatar: '', initials: 'JS' },
        { id: 'u12', name: 'Ryan Anderson', avatar: '', initials: 'RA' },
        { id: 'u13', name: 'Sophia White', avatar: '', initials: 'SW' },
      ],
      userCount: 7,
      lastModified: new Date('2025-18-16'),
      lastModifiedFormatted: '2025/18/16',
    },
    {
      id: '6',
      name: 'Clouds',
      type: 'folder',
      size: 115000,
      sizeFormatted: '115 KB',
      users: [
        { id: 'u6', name: 'Lisa Brown', avatar: '', initials: 'LB' },
        { id: 'u7', name: 'Tom Davis', avatar: '', initials: 'TD' },
        { id: 'u8', name: 'Nina Garcia', avatar: '', initials: 'NG' },
        { id: 'u14', name: 'Kevin Park', avatar: '', initials: 'KP' },
      ],
      userCount: 4,
      lastModified: new Date('2025-18-16'),
      lastModifiedFormatted: '2025/18/16',
    },
    {
      id: '7',
      name: 'Work',
      type: 'folder',
      size: 100000,
      sizeFormatted: '100 KB',
      users: [
        { id: 'u9', name: 'Alex Kim', avatar: '', initials: 'AK' },
        { id: 'u10', name: 'Chris Taylor', avatar: '', initials: 'CT' },
        { id: 'u15', name: 'Maya Patel', avatar: '', initials: 'MP' },
        { id: 'u16', name: 'Oliver Harris', avatar: '', initials: 'OH' },
      ],
      userCount: 7,
      lastModified: new Date('2025-18-16'),
      lastModifiedFormatted: '2025/18/16',
    },
    {
      id: '8',
      name: 'Important',
      type: 'folder',
      size: 1181000000,
      sizeFormatted: '1.181 MB',
      users: [
        { id: 'u11', name: 'Julia Martinez', avatar: '', initials: 'JM' },
        { id: 'u12', name: 'Ryan Anderson', avatar: '', initials: 'RA' },
        { id: 'u13', name: 'Sophia White', avatar: '', initials: 'SW' },
        { id: 'u14', name: 'Kevin Park', avatar: '', initials: 'KP' },
        { id: 'u15', name: 'Maya Patel', avatar: '', initials: 'MP' },
        { id: 'u16', name: 'Oliver Harris', avatar: '', initials: 'OH' },
      ],
      userCount: 6,
      lastModified: new Date('2025-18-16'),
      lastModifiedFormatted: '2025/18/16',
    },
  ],
  
  secretFiles: [
    {
      id: 's1',
      name: 'Berseek Vol 32.pdf',
      type: 'document',
      size: 25000000,
      sizeFormatted: '25 MB',
      users: [],
      userCount: 0,
      lastModified: new Date('2025/18/16'),
      lastModifiedFormatted: '2025/18/16',
      permission: 'Editor',
    },
    {
      id: 's2',
      name: 'Invoice Dec 23.doc',
      type: 'document',
      size: 44000000000,
      sizeFormatted: '44 GB',
      users: [],
      userCount: 0,
      lastModified: new Date('2025/18/16'),
      lastModifiedFormatted: '2025/18/16',
      permission: 'View Only',
    },
    {
      id: 's3',
      name: 'Screenshot 22.jpg',
      type: 'image',
      size: 798000000000000,
      sizeFormatted: '798 TB',
      users: [],
      userCount: 0,
      lastModified: new Date('2025/18/16'),
      lastModifiedFormatted: '2025/18/16',
      permission: 'Editor',
    },
    {
      id: 's4',
      name: 'React Component.tsx',
      type: 'code',
      size: 155000,
      sizeFormatted: '155 KB',
      users: [],
      userCount: 0,
      lastModified: new Date('2025/18/16'),
      lastModifiedFormatted: '2025/18/16',
      permission: 'Administrator',
    },
    {
      id: 's5',
      name: 'Landing Page.html',
      type: 'code',
      size: 1181000000,
      sizeFormatted: '1.181 MB',
      users: [],
      userCount: 0,
      lastModified: new Date('2025/18/16'),
      lastModifiedFormatted: '2025/18/16',
      permission: 'Administrator',
    },
    {
      id: 's6',
      name: 'Website Styles.css',
      type: 'code',
      size: 1251000000000,
      sizeFormatted: '1,251 TB',
      users: [],
      userCount: 0,
      lastModified: new Date('2025/18/16'),
      lastModifiedFormatted: '2025/18/16',
      permission: 'Editor',
    },
    {
      id: 's7',
      name: 'Cheat Codez.txt',
      type: 'text',
      size: 889000,
      sizeFormatted: '889 KB',
      users: [],
      userCount: 0,
      lastModified: new Date('2025/18/16'),
      lastModifiedFormatted: '2025/18/16',
      permission: 'View Only',
    },
  ],
  
  recentFiles: [
    {
      id: 'r1',
      name: 'filename.txt',
      type: 'text',
      size: 12000,
      sizeFormatted: '12 KB',
      users: [],
      userCount: 0,
      lastModified: new Date(),
      lastModifiedFormatted: new Date().toLocaleDateString(),
    },
    {
      id: 'r2',
      name: '2028-19-88_do-not-...',
      type: 'archive',
      size: 524000,
      sizeFormatted: '524 KB',
      users: [],
      userCount: 0,
      lastModified: new Date(),
      lastModifiedFormatted: new Date().toLocaleDateString(),
    },
    {
      id: 'r3',
      name: 'SecretFolder',
      type: 'folder',
      size: 0,
      sizeFormatted: '—',
      users: [],
      userCount: 0,
      lastModified: new Date(),
      lastModifiedFormatted: new Date().toLocaleDateString(),
    },
    {
      id: 'r4',
      name: 'filename.t',
      type: 'text',
      size: 8000,
      sizeFormatted: '8 KB',
      users: [],
      userCount: 0,
      lastModified: new Date(),
      lastModifiedFormatted: new Date().toLocaleDateString(),
    },
  ],
  
  selectedFileIds: [],
  searchQuery: '',
  currentView: 'list',
  storageUsed: 17.2,
  storageTotal: 20,
  fileStats: {
    totalViews: 198,
    totalEdits: 16,
    totalComments: 11,
    totalShares: 87,
    totalDeletes: 77,
    weeklyInsights: [
      { day: 'Mon', value: 4200 },
      { day: 'Tue', value: 5100 },
      { day: 'Wed', value: 6712 },
      { day: 'Thu', value: 4800 },
      { day: 'Fri', value: 3900 },
      { day: 'Sat', value: 5600 },
      { day: 'Sun', value: 4500 },
    ],
  },
  
  toggleFileSelection: (fileId) =>
    set((state) => ({
      selectedFileIds: state.selectedFileIds.includes(fileId)
        ? state.selectedFileIds.filter((id) => id !== fileId)
        : [...state.selectedFileIds, fileId],
    })),
    
  selectAllFiles: () =>
    set((state) => ({
      selectedFileIds: state.myFiles.map((file) => file.id),
    })),
    
  deselectAllFiles: () =>
    set({ selectedFileIds: [] }),
    
  setSearchQuery: (query) =>
    set({ searchQuery: query }),
    
  setCurrentView: (view) =>
    set({ currentView: view }),
    
  deleteFiles: (fileIds) =>
    set((state) => ({
      myFiles: state.myFiles.filter((file) => !fileIds.includes(file.id)),
      secretFiles: state.secretFiles.filter((file) => !fileIds.includes(file.id)),
      selectedFileIds: [],
    })),
    
  setFileStats: (stats) =>
    set({ fileStats: stats }),
}))
