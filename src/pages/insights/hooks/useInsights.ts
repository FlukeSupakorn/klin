import { useState, useEffect } from 'react'
import { useHomeStore } from '@/pages/home/store/useHomeStore'
import { getFeaturedFolders, type FolderInsight } from '@/lib/ai-api'
import { createMockFileTree } from '../utils/fileTree'
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

  useEffect(() => {
    if (destinationFolders.length > 0) {
      loadFileTree()
    }
  }, [destinationFolders])

  const loadFileTree = () => {
    const tree = destinationFolders.map(createMockFileTree)
    setFileTree(tree)
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
