import { FolderOpen } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { FileIcon } from '@/components/file/file-icon'
import { FileItem } from '@/lib/tauri-api'
import { openFile } from '@/lib/tauri-api'
import { useFileStore } from '@/store/useFileStore'
import { formatFileSize, formatDate, getFileType } from './utils'
import { usePagination } from '../hooks/usePagination'
import { GridSkeleton, ListSkeleton, TabSkeleton, LoadingMoreSkeleton } from './FileSkeleton'

interface FileListViewProps {
  files: FileItem[]
  selectedFileIds: string[]
  onToggleSelection: (id: string) => void
  loading: boolean
}

export function FileListView({ files, selectedFileIds, onToggleSelection, loading }: FileListViewProps) {
  const { currentView } = useFileStore()

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
      <div className="bg-theme-background border border-theme rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          {currentView === 'grid' && <GridSkeleton count={100} />}
          {currentView === 'list' && <ListSkeleton count={100} />}
          {currentView === 'tab' && <TabSkeleton count={100} />}
        </div>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 bg-theme-background border border-theme rounded-xl shadow-sm">
        <div className="text-center">
          <FolderOpen className="h-16 w-16 text-theme-muted mx-auto mb-4" />
          <p className="text-theme-secondary">No files found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-theme-background border border-theme rounded-xl shadow-sm overflow-hidden">
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
              return (
                <tr
                  key={file.path}
                  className={`hover-bg-theme-secondary transition-colors ${isSelected ? 'bg-theme-primary-light' : ''}`}
                >
                  <td className="py-4 px-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelection(file.path)}
                      aria-label={`Select ${file.name}`}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <FileIcon
                        type={getFileType(file.name, file.is_dir)}
                        className="h-5 w-5 text-theme-primary"
                      />
                      <span 
                        className="font-medium text-theme-text truncate max-w-md cursor-pointer hover-text-theme-primary transition-colors" 
                        title={file.name}
                        onClick={() => handleOpenFile(file.path)}
                      >
                        {file.name}
                      </span>
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
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {displayedFiles.map((file) => {
              const isSelected = selectedFileIds.includes(file.path)
              return (
                <div
                  key={file.path}
                  className={`bg-theme-background border border-theme rounded-xl p-4 hover:shadow-md transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-theme-primary border-theme-primary' : ''
                  }`}
                  onClick={() => onToggleSelection(file.path)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelection(file.path)}
                      aria-label={`Select ${file.name}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="h-24 bg-theme-tertiary rounded-lg mb-4 flex items-center justify-center">
                    <FileIcon
                      type={getFileType(file.name, file.is_dir)}
                      className="h-12 w-12 text-theme-primary"
                    />
                  </div>

                  <h3 
                    className="font-semibold text-theme-text mb-1 truncate cursor-pointer hover-text-theme-primary transition-colors" 
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
        <div className="space-y-6 p-6">
          <div className="space-y-3">
            {displayedFiles.map((file) => {
              const isSelected = selectedFileIds.includes(file.path)
              return (
                <div
                  key={file.path}
                  className={`bg-theme-background border border-theme rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-theme-primary border-theme-primary' : ''
                  }`}
                  onClick={() => onToggleSelection(file.path)}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleSelection(file.path)}
                      aria-label={`Select ${file.name}`}
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="h-12 w-12 bg-theme-tertiary rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileIcon
                        type={getFileType(file.name, file.is_dir)}
                        className="h-6 w-6 text-theme-primary"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 
                        className="font-semibold text-theme-text truncate cursor-pointer hover-text-theme-primary transition-colors" 
                        title={file.name}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenFile(file.path)
                        }}
                      >
                        {file.name}
                      </h3>
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
