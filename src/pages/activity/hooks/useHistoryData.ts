import { useState, useMemo } from 'react'
import { useFileStore } from '@/store/useFileStore'

export function useHistoryData() {
  const secretFiles = useFileStore((state) => state.secretFiles)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState(secretFiles[0])

  const filteredFiles = useMemo(() => {
    return secretFiles.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [secretFiles, searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    filteredFiles,
    selectedFile,
    setSelectedFile,
  }
}
