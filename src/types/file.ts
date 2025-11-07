export type FilePermission = 'Editor' | 'View Only' | 'Administrator'

export interface User {
  id: string
  name: string
  avatar: string
  initials: string
}

export interface FileItem {
  id: string
  name: string
  type: 'folder' | 'image' | 'gif' | 'video' | 'document' | 'code' | 'archive' | 'text'
  size: number
  sizeFormatted: string
  users: User[]
  userCount: number
  lastModified: Date
  lastModifiedFormatted: string
  permission?: FilePermission
  views?: number
  edits?: number
  comments?: number
  shares?: number
  deletes?: number
}

export interface FileStats {
  totalViews: number
  totalEdits: number
  totalComments: number
  totalShares: number
  totalDeletes: number
  weeklyInsights: {
    day: string
    value: number
  }[]
}
