import { useActivityStore, ActivityItem } from '../store/useActivityStore'
import { FileIcon } from '@/components/file/file-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, XCircle, Edit2, Loader2, FolderOpen } from 'lucide-react'
import { useState } from 'react'
import { getFileType } from '@/pages/home/file-list/utils'

interface ActivityQueueProps {
  searchQuery: string
}

export function ActivityQueue({ searchQuery }: ActivityQueueProps) {
  const queue = useActivityStore((state) => state.queue)
  const updateQueueItem = useActivityStore((state) => state.updateQueueItem)
  const editItemName = useActivityStore((state) => state.editItemName)
  const editItemFolder = useActivityStore((state) => state.editItemFolder)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingField, setEditingField] = useState<'name' | 'folder' | null>(null)
  const [editValue, setEditValue] = useState('')

  const filteredQueue = queue.filter((item) =>
    item.original_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStartEdit = (item: ActivityItem, field: 'name' | 'folder') => {
    setEditingId(item.id)
    setEditingField(field)
    setEditValue(
      field === 'name'
        ? item.editedName || item.suggested_name
        : item.editedFolder || item.suggested_folder
    )
  }

  const handleSaveEdit = (id: string) => {
    if (editingField === 'name') {
      editItemName(id, editValue)
    } else if (editingField === 'folder') {
      editItemFolder(id, editValue)
    }
    setEditingId(null)
    setEditingField(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingField(null)
  }

  const handleCardClick = (item: ActivityItem) => {
    if (item.status !== 'completed') return
    if (editingId) return // Don't toggle while editing

    // Toggle between approved and rejected
    const newAction = item.userAction === 'approved' ? 'rejected' : 'approved'
    updateQueueItem(item.id, { userAction: newAction })
  }

  const canEditName = (item: ActivityItem) => {
    return !item.auto_rename_applied && item.status === 'completed'
  }

  const canEditFolder = (item: ActivityItem) => {
    return !item.auto_move_applied && item.status === 'completed'
  }

  return (
    <div className="space-y-3">
      {filteredQueue.map((item) => (
        <div
          key={item.id}
          onClick={() => handleCardClick(item)}
          className={`bg-theme-background border rounded-lg p-4 transition-all ${
            item.status === 'processing'
              ? 'border-theme-primary bg-theme-primary-light'
              : item.userAction === 'approved'
              ? 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-950/30 cursor-pointer hover:border-green-500 dark:hover:border-green-500'
              : item.userAction === 'rejected'
              ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-950/30 cursor-pointer hover:border-red-500 dark:hover:border-red-500'
              : item.status === 'completed'
              ? 'border-theme cursor-pointer hover:border-theme-primary'
              : 'border-theme'
          }`}
        >
          <div className="flex items-start gap-4">
            {/* File Icon */}
            <div className="flex-shrink-0 text-slate-700 dark:text-slate-300">
              <FileIcon type={getFileType(item.original_name, false)} />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              {/* Original Name */}
              <div className="mb-2">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Original:</span>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                  {item.original_name}
                </p>
              </div>

              {/* Status */}
              {item.status === 'processing' && (
                <div className="flex items-center gap-2 text-theme-primary mb-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Processing...</span>
                </div>
              )}

              {item.status === 'completed' && (
                <>
                  {/* New Name */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {item.auto_rename_applied ? 'Renamed to:' : 'Suggested name:'}
                      </span>
                      {canEditName(item) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartEdit(item, 'name')
                          }}
                          className="text-theme-primary hover:text-theme-primary-hover"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {editingId === item.id && editingField === 'name' ? (
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {item.editedName || item.suggested_name}
                        {item.auto_rename_applied && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Applied</span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* New Folder */}
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {item.auto_move_applied ? 'Moved to:' : 'Suggested folder:'}
                      </span>
                      {canEditFolder(item) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartEdit(item, 'folder')
                          }}
                          className="text-theme-primary hover:text-theme-primary-hover"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {editingId === item.id && editingField === 'folder' ? (
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {item.editedFolder || item.suggested_folder}
                          {item.auto_move_applied && (
                            <span className="ml-2 text-xs text-green-600 dark:text-green-400">✓ Applied</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* User Action Status Badge */}
              {item.status === 'completed' && (
                <div className="mt-2">
                  {item.userAction === 'approved' ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-950/50 border border-green-400 dark:border-green-600 rounded text-xs text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Approved (click to reject)</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-950/50 border border-red-400 dark:border-red-600 rounded text-xs text-red-700 dark:text-red-400">
                      <XCircle className="h-3 w-3" />
                      <span>Rejected (click to approve)</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
