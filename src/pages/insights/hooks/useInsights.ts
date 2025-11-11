import { useState, useEffect } from 'react'
import { useHomeStore } from '@/pages/home/store/useHomeStore'
import { getFeaturedFolders, type FolderInsight } from '@/lib/ai-api'
import { createFileTree } from '../utils/fileTree'
import { FileNode } from '../components/FileTreeNode'

/**
 * Hook for managing featured folders insights
 */
export function useFeaturedFolders() {
  const destinationFolders = useHomeStore((state) => state.destinationFolders)
  const [featuredFolders, setFeaturedFolders] = useState<FolderInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (destinationFolders.length > 0) {
      loadFeaturedFolders()
    } else {
      setIsLoading(false)
    }
  }, [destinationFolders])

  const loadFeaturedFolders = async () => {
    setIsLoading(true)
    try {
      const featured = await getFeaturedFolders(destinationFolders)
      setFeaturedFolders(featured)
    } catch (error) {
      console.error('Failed to load featured folders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    featuredFolders,
    isLoading,
    reload: loadFeaturedFolders,
    hasDestinations: destinationFolders.length > 0,
  }
}

/**
 * Hook for managing file tree explorer
 */
export function useFileTree() {
  const destinationFolders = useHomeStore((state) => state.destinationFolders)
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (destinationFolders.length > 0) {
      loadFileTree()
    } else {
      setFileTree([])
      setIsLoading(false)
    }
  }, [destinationFolders])

  const loadFileTree = async () => {
    setIsLoading(true)
    try {
      // Load real file trees from all destination folders
      const trees = await Promise.all(
        destinationFolders.map((folder) => createFileTree(folder))
      )
      setFileTree(trees)
    } catch (error) {
      console.error('Failed to load file trees:', error)
      setFileTree([])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  return {
    fileTree,
    expandedFolders,
    toggleFolder,
    isLoading,
  }
}

/**
 * Hook for managing horizontal scroll navigation
 */
export function useHorizontalScroll() {
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('featured-scroll')
    if (container) {
      const scrollAmount = 400
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' })
      setScrollPosition(newPosition)
    }
  }

  return {
    scrollPosition,
    scrollLeft: () => handleScroll('left'),
    scrollRight: () => handleScroll('right'),
  }
}
