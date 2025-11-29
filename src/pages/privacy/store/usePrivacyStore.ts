import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ExcludePatternType = 'starts-with' | 'ends-with' | 'contains' | 'matches-date' | 'extension'

export interface ExcludePattern {
  id: string
  type: ExcludePatternType
  value: string // for date, use YYYY-MM-DD or regex-like token
  description?: string
}

export interface PrivacyState {
  excludedFiles: string[] // absolute paths
  excludedFolders: string[] // absolute paths
  patterns: ExcludePattern[]

  addExcludedFile: (path: string) => void
  removeExcludedFile: (path: string) => void
  addExcludedFolder: (path: string) => void
  removeExcludedFolder: (path: string) => void

  addPattern: (p: ExcludePattern) => void
  updatePattern: (p: ExcludePattern) => void
  removePattern: (id: string) => void

  shouldExclude: (filePath: string, fileName: string) => boolean
}

function safeUnique<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr : [...arr, item]
}

function normalizeExt(ext: string): string {
  return ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set, get) => ({
      excludedFiles: [],
      excludedFolders: [],
      patterns: [],

      addExcludedFile: (path) => set((s) => ({ excludedFiles: safeUnique(s.excludedFiles, path) })),
      removeExcludedFile: (path) => set((s) => ({ excludedFiles: s.excludedFiles.filter(p => p !== path) })),
      addExcludedFolder: (path) => set((s) => ({ excludedFolders: safeUnique(s.excludedFolders, path) })),
      removeExcludedFolder: (path) => set((s) => ({ excludedFolders: s.excludedFolders.filter(p => p !== path) })),

      addPattern: (p) => set((s) => ({ patterns: [...s.patterns, p] })),
      updatePattern: (p) => set((s) => ({ patterns: s.patterns.map(x => x.id === p.id ? p : x) })),
      removePattern: (id) => set((s) => ({ patterns: s.patterns.filter(x => x.id !== id) })),

      shouldExclude: (filePath: string, fileName: string) => {
        const { excludedFiles, excludedFolders, patterns } = get()
        // Direct file path match
        if (excludedFiles.includes(filePath)) return true
        // Folder ancestor match
        if (excludedFolders.some(folder => filePath.startsWith(folder))) return true
        // Pattern-based checks
        for (const p of patterns) {
          switch (p.type) {
            case 'starts-with':
              if (fileName.toLowerCase().startsWith(p.value.toLowerCase())) return true
              break
            case 'ends-with':
              if (fileName.toLowerCase().endsWith(p.value.toLowerCase())) return true
              break
            case 'contains':
              if (fileName.toLowerCase().includes(p.value.toLowerCase())) return true
              break
            case 'extension': {
              const ext = fileName.includes('.') ? `.${fileName.split('.').pop()!.toLowerCase()}` : ''
              if (ext && normalizeExt(p.value) === ext) return true
              break
            }
            case 'matches-date': {
              // Simple date match: if value is YYYY-MM-DD, exclude files that contain this date in name
              const token = p.value.trim()
              if (token && fileName.includes(token)) return true
              break
            }
          }
        }
        return false
      }
    }),
    { name: 'klin-privacy-store' }
  )
)
