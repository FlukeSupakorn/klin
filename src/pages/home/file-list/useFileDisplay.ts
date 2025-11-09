import { useFileStore } from '@/store/useFileStore'
import { formatFileSize, formatDate, getFileType } from './utils'

export function useFileDisplay() {
  const { currentView, setCurrentView } = useFileStore()

  return {
    currentView,
    setCurrentView,
    formatFileSize,
    formatDate,
    getFileType,
  }
}
