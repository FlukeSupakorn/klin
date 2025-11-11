import { useState, useEffect, useCallback, useRef } from 'react'

interface UsePaginationOptions<T> {
  items: T[]
  itemsPerPage?: number
  enabled?: boolean
}

interface UsePaginationReturn<T> {
  displayedItems: T[]
  hasMore: boolean
  isLoadingMore: boolean
  loadMore: () => void
  reset: () => void
  observerRef: (node: HTMLElement | null) => void
}

const ITEMS_PER_PAGE = 100

export function usePagination<T>({
  items,
  itemsPerPage = ITEMS_PER_PAGE,
  enabled = true,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate displayed items
  const displayedItems = enabled ? items.slice(0, displayedCount) : items
  const hasMore = displayedCount < items.length

  // Reset pagination when items change
  useEffect(() => {
    setDisplayedCount(itemsPerPage)
  }, [items.length, itemsPerPage])

  // Load more items
  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore || !enabled) return

    setIsLoadingMore(true)

    // Simulate loading delay (even though Rust is fast, show skeleton briefly for UX)
    loadingTimeoutRef.current = setTimeout(() => {
      setDisplayedCount((prev) => Math.min(prev + itemsPerPage, items.length))
      setIsLoadingMore(false)
    }, 200) // Very short delay just to show skeleton
  }, [hasMore, isLoadingMore, enabled, itemsPerPage, items.length])

  // Reset pagination
  const reset = useCallback(() => {
    setDisplayedCount(itemsPerPage)
    setIsLoadingMore(false)
  }, [itemsPerPage])

  // Intersection Observer callback ref
  const setObserverRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      if (!node || !enabled) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
            loadMore()
          }
        },
        {
          threshold: 0.1,
          rootMargin: '100px', // Load slightly before reaching bottom
        }
      )

      observerRef.current.observe(node)
    },
    [hasMore, isLoadingMore, loadMore, enabled]
  )

  // Cleanup
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [])

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    loadMore,
    reset,
    observerRef: setObserverRef,
  }
}
