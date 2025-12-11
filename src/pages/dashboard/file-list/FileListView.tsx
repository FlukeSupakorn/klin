import { FolderOpen, Lock, Unlock } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { FileIcon } from '@/components/file/file-icon'
import { FileItem } from '@/lib/tauri-api'
import { openFile } from '@/lib/tauri-api'
import { useFileStore } from '@/store/useFileStore'
import { usePrivacyStore } from '@/pages/privacy/store/usePrivacyStore'
import { formatFileSize, formatDate, getFileType } from './utils'
import { usePagination } from '../hooks/usePagination'
import { GridSkeleton, ListSkeleton, TabSkeleton, LoadingMoreSkeleton } from './FileSkeleton'
import { useState } from 'react'

interface FileListViewProps {
  files: FileItem[]
  selectedFileIds: string[]
  onToggleSelection: (id: string) => void
  loading: boolean
}

export function FileListView({ files, selectedFileIds, onToggleSelection, loading }: FileListViewProps) {
  const { currentView } = useFileStore()
  const shouldExclude = usePrivacyStore((s) => s.shouldExclude)
  const removeExcludedFile = usePrivacyStore((s) => s.removeExcludedFile)
  const [hoveringLock, setHoveringLock] = useState<string | null>(null)

  const handleUnlockFile = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeExcludedFile(filePath)
  }

  // Pagination with 100 items per page
  const {
    displayedItems: displayedFiles,
    hasMore,
    isLoadingMore,
    observerRef,
  } = usePagination({
    items: files,
    itemsPerPage: 100,
    enabled: !loading,
  })

  const handleOpenFile = async (filePath: string) => {
    try {
      await openFile(filePath)
    } catch (error) {
      console.error('Failed to open file:', error)
    }
  }

  // Initial loading state
  if (loading) {
    return (
      <div className="bg-theme-background overflow-hidden">
        <div className="">
          {currentView === 'grid' && <GridSkeleton count={100} />}
          {currentView === 'list' && <ListSkeleton count={100} />}
          {currentView === 'tab' && <TabSkeleton count={100} />}
        </div>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 bg-theme-background">
        <div className="text-center">
          <FolderOpen className="h-16 w-16 text-theme-muted mx-auto mb-4" />
          <p className="text-theme-secondary">No files found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-theme-background overflow-hidden">
      {/* List View */}
      {currentView === 'list' && (
        <table className="w-full">
          <thead className="bg-theme-secondary border-b border-theme">
            <tr>
              <th className="py-3 px-4 text-left w-12">
                <span className="sr-only">Select</span>
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-theme-text">
                <div className="flex items-center gap-2">
                  <FileIcon type="folder" className="h-4 w-4" />
                  <span>File Name</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-theme-text">File Size</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-theme-text">
                Last Modified
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            {displayedFiles.map((file) => {
              const isSelected = selectedFileIds.includes(file.path)
              const isLocked = shouldExclude(file.path, file.name)
              return (
                <tr
                  key={file.path}
                  className={`hover-bg-theme-secondary transition-colors ${isSelected ? 'bg-theme-primary-light' : ''} ${isLocked ? 'opacity-60' : ''}`}
                >
                  <td className="py-4 px-4">
                    {isLocked ? (
                      <button
                        onClick={(e) => handleUnlockFile(file.path, e)}
                        onMouseEnter={() => setHoveringLock(file.path)}
                        onMouseLeave={() => setHoveringLock(null)}
                        className="h-5 w-5 flex items-center justify-center rounded hover:bg-amber-100 transition-colors"
                        title="Click to unlock"
                      >
                        {hoveringLock === file.path ? (
                          <Unlock className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-amber-500" />
                        )}
                      </button>
                    ) : (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelection(file.path)}
                        aria-label={`Select ${file.name}`}
                      />
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <FileIcon
                          type={getFileType(file.name, file.is_dir)}
                          className="h-5 w-5 text-theme-primary"
                        />
                        {isLocked && (
                          <div className="absolute -bottom-1 -right-1 bg-amber-100 rounded-full p-0.5">
                            <Lock className="h-2.5 w-2.5 text-amber-600" />
                          </div>
                        )}
                      </div>
                      <span
                        className={`font-medium truncate max-w-md cursor-pointer hover-text-theme-primary transition-colors ${isLocked ? 'text-theme-secondary' : 'text-theme-text'}`}
                        title={file.name}
                        onClick={() => handleOpenFile(file.path)}
                      >
                        {file.name}
                      </span>
                      {isLocked && (
                        <span className="text-[10px] font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                          LOCKED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-theme-secondary">{formatFileSize(file.size)}</td>
                  <td className="py-4 px-4 text-sm text-theme-secondary">{formatDate(file.modified)}</td>
                </tr>
              )
            })}
            {/* Intersection Observer Target */}
            {hasMore && (
              <tr ref={observerRef as any}>
                <td colSpan={4} className="py-4">
                  {isLoadingMore && (
                    <div className="px-4">
                      <ListSkeleton count={4} />
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Grid View */}
      {currentView === 'grid' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 p-1">
            {displayedFiles.map((file) => {
              const isSelected = selectedFileIds.includes(file.path)
              const isLocked = shouldExclude(file.path, file.name)
              return (
                <div
                  key={file.path}
                  className={`bg-theme-secondary/30 rounded-xl p-4 transition-all duration-200 cursor-pointer
                    shadow-sm shadow-theme-primary/5
                    hover:bg-theme-secondary hover:shadow-lg hover:shadow-theme-primary/10 hover:scale-[1.02]
                    ${isSelected ? 'ring-2 ring-theme-primary bg-theme-primary/5 shadow-md shadow-theme-primary/10' : ''}
                    ${isLocked ? 'opacity-70 ring-2 ring-amber-300 bg-amber-50/50' : ''}`}
                  onClick={() => !isLocked && onToggleSelection(file.path)}
                >
                  <div className="flex items-start justify-between mb-3">
                    {isLocked ? (
                      <button
                        onClick={(e) => handleUnlockFile(file.path, e)}
                        onMouseEnter={() => setHoveringLock(file.path)}
                        onMouseLeave={() => setHoveringLock(null)}
                        className="h-5 w-5 flex items-center justify-center rounded hover:bg-amber-100 transition-colors"
                        title="Click to unlock"
                      >
                        {hoveringLock === file.path ? (
                          <Unlock className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-amber-500" />
                        )}
                      </button>
                    ) : (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelection(file.path)}
                        aria-label={`Select ${file.name}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                    {isLocked && (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                        LOCKED
                      </span>
                    )}
                  </div>

                  <div className="h-24 bg-theme-tertiary rounded-lg mb-4 flex items-center justify-center relative">
                    <FileIcon
                      type={getFileType(file.name, file.is_dir)}
                      className="h-12 w-12 text-theme-primary"
                    />
                    {isLocked && (
                      <div className="absolute bottom-2 right-2 bg-amber-100 rounded-full p-1">
                        <Lock className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                    )}
                  </div>

                  <h3
                    className={`font-semibold mb-1 truncate cursor-pointer hover-text-theme-primary transition-colors ${isLocked ? 'text-theme-secondary' : 'text-theme-text'}`}
                    title={file.name}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenFile(file.path)
                    }}
                  >
                    {file.name}
                  </h3>
                  <p className="text-sm text-theme-secondary mb-3">{formatFileSize(file.size)}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-theme-muted">{formatDate(file.modified)}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Loading More Skeleton */}
          {hasMore && (
            <div ref={observerRef as any}>
              {isLoadingMore && <LoadingMoreSkeleton view="grid" />}
            </div>
          )}
        </div>
      )}

      {/* Tab View */}
      {currentView === 'tab' && (
        <div className="space-y-4">
          <div className="space-y-2 p-1">
            {displayedFiles.map((file) => {
              const isSelected = selectedFileIds.includes(file.path)
              const isLocked = shouldExclude(file.path, file.name)
              return (
                <div
                  key={file.path}
                  className={`bg-theme-secondary/30 rounded-xl p-4 transition-all duration-200 cursor-pointer
                    shadow-sm shadow-theme-primary/5
                    hover:bg-theme-secondary hover:shadow-md hover:shadow-theme-primary/10
                    ${isSelected ? 'ring-2 ring-theme-primary bg-theme-primary/5 shadow-sm shadow-theme-primary/10' : ''}
                    ${isLocked ? 'opacity-70 ring-2 ring-amber-300 bg-amber-50/50' : ''}`}
                  onClick={() => !isLocked && onToggleSelection(file.path)}
                >
                  <div className="flex items-center gap-4">
                    {isLocked ? (
                      <button
                        onClick={(e) => handleUnlockFile(file.path, e)}
                        onMouseEnter={() => setHoveringLock(file.path)}
                        onMouseLeave={() => setHoveringLock(null)}
                        className="h-5 w-5 flex items-center justify-center rounded hover:bg-amber-100 transition-colors"
                        title="Click to unlock"
                      >
                        {hoveringLock === file.path ? (
                          <Unlock className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-amber-500" />
                        )}
                      </button>
                    ) : (
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelection(file.path)}
                        aria-label={`Select ${file.name}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}

                    <div className="h-12 w-12 bg-theme-tertiary rounded-lg flex items-center justify-center flex-shrink-0 relative">
                      <FileIcon
                        type={getFileType(file.name, file.is_dir)}
                        className="h-6 w-6 text-theme-primary"
                      />
                      {isLocked && (
                        <div className="absolute -bottom-1 -right-1 bg-amber-100 rounded-full p-0.5">
                          <Lock className="h-2.5 w-2.5 text-amber-600" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-semibold truncate cursor-pointer hover-text-theme-primary transition-colors ${isLocked ? 'text-theme-secondary' : 'text-theme-text'}`}
                          title={file.name}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenFile(file.path)
                          }}
                        >
                          {file.name}
                        </h3>
                        {isLocked && (
                          <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                            LOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-theme-secondary">
                        {formatFileSize(file.size)} • {formatDate(file.modified)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Loading More Skeleton */}
          {hasMore && (
            <div ref={observerRef as any}>
              {isLoadingMore && <LoadingMoreSkeleton view="tab" />}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
