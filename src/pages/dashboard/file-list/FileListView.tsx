import { FolderOpen, Lock, Unlock, Shield, ArrowUp, ArrowDown } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { FileIcon } from '@/components/file/file-icon'
import { FileItem, checkIsEncrypted } from '@/lib/tauri-api'
import { openFile } from '@/lib/tauri-api'
import { useFileStore } from '@/store/useFileStore'
import { usePrivacyStore } from '@/pages/privacy/store/usePrivacyStore'
import { formatFileSize, formatDate, getFileType } from './utils'
import { usePagination } from '../hooks/usePagination'
import { GridSkeleton, ListSkeleton, TabSkeleton, LoadingMoreSkeleton } from './FileSkeleton'
import { useState, useEffect } from 'react'
import { EncryptionInfoDialog } from '@/components/EncryptionInfoDialog'
import { EncryptFileDialog } from '@/components/EncryptFileDialog'

interface FileListViewProps {
  files: FileItem[]
  selectedFileIds: string[]
  onToggleSelection: (id: string) => void
  loading: boolean
  onRefresh?: () => void
}

export function FileListView({ files, selectedFileIds, onToggleSelection, loading, onRefresh }: FileListViewProps) {
  const { currentView } = useFileStore()
  const shouldExclude = usePrivacyStore((s) => s.shouldExclude)
  const removeExcludedFile = usePrivacyStore((s) => s.removeExcludedFile)
  const [hoveringLock, setHoveringLock] = useState<string | null>(null)
  const [encryptedFiles, setEncryptedFiles] = useState<Set<string>>(new Set())
  const [selectedEncryptionFile, setSelectedEncryptionFile] = useState<string | null>(null)
  const [showEncryptionDialog, setShowEncryptionDialog] = useState(false)
  const [showEncryptFileDialog, setShowEncryptFileDialog] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Check encryption status for all PDF files
  useEffect(() => {
    const checkEncryption = async () => {
      const encrypted = new Set<string>()
      
      for (const file of files) {
        if (file.name.toLowerCase().endsWith('.pdf')) {
          try {
            const isEncrypted = await checkIsEncrypted(file.path)
            if (isEncrypted) {
              encrypted.add(file.path)
            }
          } catch (error) {
            // Silently fail if unable to check
          }
        }
      }
      
      setEncryptedFiles(encrypted)
    }
    
    if (files.length > 0) {
      checkEncryption()
    }
  }, [files])

  const handleUnlockFile = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeExcludedFile(filePath)
  }

  const handleEncryptionIconClick = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEncryptionFile(filePath)
    setShowEncryptionDialog(true)
  }

  const handleEncryptFileClick = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEncryptionFile(filePath)
    setShowEncryptFileDialog(true)
  }

  const handleEncryptionDialogClose = () => {
    setShowEncryptionDialog(false)
    setSelectedEncryptionFile(null)
  }

  const handleEncryptFileDialogClose = () => {
    setShowEncryptFileDialog(false)
    setSelectedEncryptionFile(null)
  }

  const handleEncryptionComplete = () => {
    // Refresh encryption status
    if (onRefresh) {
      onRefresh()
    }
  }

  const handleHeaderClick = (column: 'name' | 'size' | 'date') => {
    if (sortBy === column) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Change sort column
      setSortBy(column)
      setSortOrder('asc')
    }
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

  const sortedDisplayedFiles = [...displayedFiles].sort((a, b) => {
    let compareValue = 0

    switch (sortBy) {
      case 'name':
        compareValue = a.name.localeCompare(b.name)
        break
      case 'size':
        compareValue = a.size - b.size
        break
      case 'date':
        compareValue = new Date(a.modified || 0).getTime() - new Date(b.modified || 0).getTime()
        break
    }

    return sortOrder === 'asc' ? compareValue : -compareValue
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
              <th
                className="py-3 px-4 text-left text-sm font-semibold text-theme-text cursor-pointer hover:bg-theme-tertiary/30 transition-colors"
                onClick={() => handleHeaderClick('name')}
              >
                <div className="flex items-center gap-2">
                  <FileIcon type="folder" className="h-4 w-4" />
                  <span>File Name</span>
                  {sortBy === 'name' && (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="h-4 w-4 text-theme-primary" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-theme-primary" />
                    )
                  )}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left text-sm font-semibold text-theme-text cursor-pointer hover:bg-theme-tertiary/30 transition-colors"
                onClick={() => handleHeaderClick('size')}
              >
                <div className="flex items-center gap-2">
                  <span>File Size</span>
                  {sortBy === 'size' && (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="h-4 w-4 text-theme-primary" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-theme-primary" />
                    )
                  )}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left text-sm font-semibold text-theme-text cursor-pointer hover:bg-theme-tertiary/30 transition-colors"
                onClick={() => handleHeaderClick('date')}
              >
                <div className="flex items-center gap-2">
                  <span>Last Modified</span>
                  {sortBy === 'date' && (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="h-4 w-4 text-theme-primary" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-theme-primary" />
                    )
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme">
            {sortedDisplayedFiles.map((file) => {
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
                  {/* Encryption Status */}
                  <td className="py-4 px-4">
                    {encryptedFiles.has(file.path) && (
                      <button
                        onClick={(e) => handleEncryptionIconClick(file.path, e)}
                        className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        title="File is encrypted - Click to decrypt"
                      >
                        <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </button>
                    )}
                    {file.name.toLowerCase().endsWith('.pdf') && !encryptedFiles.has(file.path) && (
                      <button
                        onClick={(e) => handleEncryptFileClick(file.path, e)}
                        className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-50 hover:opacity-100"
                        title="Click to encrypt this PDF"
                      >
                        <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    )}
                  </td>
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
                    <div className="flex items-center gap-1">
                      {isLocked && (
                        <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">
                          LOCKED
                        </span>
                      )}
                      {encryptedFiles.has(file.path) && (
                        <button
                          onClick={(e) => handleEncryptionIconClick(file.path, e)}
                          className="p-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          title="File is encrypted - Click to decrypt"
                        >
                          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </button>
                      )}
                      {file.name.toLowerCase().endsWith('.pdf') && !encryptedFiles.has(file.path) && (
                        <button
                          onClick={(e) => handleEncryptFileClick(file.path, e)}
                          className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors opacity-40 hover:opacity-100"
                          title="Click to encrypt this PDF"
                        >
                          <Lock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      )}
                    </div>
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
                    {encryptedFiles.has(file.path) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEncryptionIconClick(file.path, e)
                        }}
                        className="absolute top-2 right-2 bg-blue-100 dark:bg-blue-900/30 rounded-full p-1 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                        title="File is encrypted - Click to decrypt"
                      >
                        <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </button>
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
                      {encryptedFiles.has(file.path) && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEncryptionIconClick(file.path, e)
                          }}
                          className="absolute -top-1 -right-1 bg-blue-100 dark:bg-blue-900/30 rounded-full p-0.5 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                          title="File is encrypted - Click to decrypt"
                        >
                          <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
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

      {/* Encryption Info Dialog */}
      {selectedEncryptionFile && (
        <EncryptionInfoDialog
          filePath={selectedEncryptionFile}
          fileName={files.find(f => f.path === selectedEncryptionFile)?.name || ''}
          isOpen={showEncryptionDialog}
          onClose={handleEncryptionDialogClose}
          onDecrypted={handleEncryptionComplete}
        />
      )}

      {/* Encrypt File Dialog */}
      {selectedEncryptionFile && (
        <EncryptFileDialog
          filePath={selectedEncryptionFile}
          fileName={files.find(f => f.path === selectedEncryptionFile)?.name || ''}
          isOpen={showEncryptFileDialog}
          onClose={handleEncryptFileDialogClose}
          onEncrypted={handleEncryptionComplete}
        />
      )}
    </div>
  )
}
