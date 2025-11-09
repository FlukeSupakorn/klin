import { FolderOpen, Trash2, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { FileIcon } from '@/components/file/file-icon'
import { FileItem } from '@/lib/tauri-api'
import { openFile, deleteFile } from '@/lib/tauri-api'
import { useFileStore } from '@/store/useFileStore'
import { formatFileSize, formatDate, getFileType } from './utils'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FileListViewProps {
  files: FileItem[]
  selectedFileIds: string[]
  onToggleSelection: (id: string) => void
  onFileDeleted?: () => void
  loading: boolean
}

export function FileListView({ files, selectedFileIds, onToggleSelection, onFileDeleted, loading }: FileListViewProps) {
  const { currentView } = useFileStore()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<{ path: string; name: string } | null>(null)

  const handleOpenFile = async (filePath: string) => {
    try {
      await openFile(filePath)
    } catch (error) {
      console.error('Failed to open file:', error)
      // You could show a toast notification here
    }
  }

  const handleDeleteClick = (filePath: string, fileName: string) => {
    setFileToDelete({ path: filePath, name: fileName })
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return

    try {
      await deleteFile(fileToDelete.path)
      setIsDeleteDialogOpen(false)
      setFileToDelete(null)
      // Trigger file reload after successful deletion
      if (onFileDeleted) {
        onFileDeleted()
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
      alert('Failed to delete file. Please try again.')
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
    setFileToDelete(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading files...</p>
        </div>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="text-center">
          <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600">No files found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* List View */}
      {currentView === 'list' && (
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 text-left w-12">
                <span className="sr-only">Select</span>
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <FileIcon type="folder" className="h-4 w-4" />
                  <span>File Name</span>
                </div>
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">File Size</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                Last Modified
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {files.map((file) => {
              const isSelected = selectedFileIds.includes(file.path)
              return (
                <tr
                  key={file.path}
                  className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-indigo-50' : ''}`}
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
                        className="h-5 w-5 text-indigo-600"
                      />
                      <span 
                        className="font-medium text-slate-900 truncate max-w-md cursor-pointer hover:text-indigo-600 transition-colors" 
                        title={file.name}
                        onClick={() => handleOpenFile(file.path)}
                      >
                        {file.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">{formatFileSize(file.size)}</td>
                  <td className="py-4 px-4 text-sm text-slate-600">{formatDate(file.modified)}</td>
                  <td className="py-4 px-4">
                    <button 
                      className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteClick(file.path, file.name)
                      }}
                      title="Delete file"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}

      {/* Grid View */}
      {currentView === 'grid' && (
        <div className="grid grid-cols-4 gap-4 p-6">
          {files.map((file) => {
            const isSelected = selectedFileIds.includes(file.path)
            return (
              <div
                key={file.path}
                className={`bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-indigo-600 border-indigo-600' : ''
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 cursor-pointer"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation()
                          handleDeleteClick(file.path, file.name)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="h-24 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                  <FileIcon
                    type={getFileType(file.name, file.is_dir)}
                    className="h-12 w-12 text-indigo-600"
                  />
                </div>

                <h3 
                  className="font-semibold text-slate-900 mb-1 truncate cursor-pointer hover:text-indigo-600 transition-colors" 
                  title={file.name}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOpenFile(file.path)
                  }}
                >
                  {file.name}
                </h3>
                <p className="text-sm text-slate-500 mb-3">{formatFileSize(file.size)}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{formatDate(file.modified)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tab View */}
      {currentView === 'tab' && (
        <div className="space-y-3 p-6">
          {files.map((file) => {
            const isSelected = selectedFileIds.includes(file.path)
            return (
              <div
                key={file.path}
                className={`bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-indigo-600 border-indigo-600' : ''
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

                  <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileIcon
                      type={getFileType(file.name, file.is_dir)}
                      className="h-6 w-6 text-indigo-600"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 
                      className="font-semibold text-slate-900 truncate cursor-pointer hover:text-indigo-600 transition-colors" 
                      title={file.name}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenFile(file.path)
                      }}
                    >
                      {file.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {formatFileSize(file.size)} • {formatDate(file.modified)}
                    </p>
                  </div>

                  <button
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(file.path, file.name)
                    }}
                    title="Delete file"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        fileName={fileToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}
