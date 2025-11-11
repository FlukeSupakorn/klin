import { X, Plus, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FolderListEditorProps {
  folders: string[]
  newFolderPath: string
  onNewFolderPathChange: (path: string) => void
  onBrowseFolder: () => void
  onAddFolder: () => void
  onRemoveFolder: (folder: string) => void
  emptyMessage?: string
  addButtonLabel?: string
  placeholder?: string
}

export function FolderListEditor({
  folders,
  newFolderPath,
  onNewFolderPathChange,
  onBrowseFolder,
  onAddFolder,
  onRemoveFolder,
  emptyMessage = 'No folders yet',
  addButtonLabel = 'Add',
  placeholder = 'Enter folder path or browse...',
}: FolderListEditorProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newFolderPath.trim()) {
      onAddFolder()
    }
  }

  return (
    <div className="space-y-4">
      {/* Folder List */}
      {folders.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
          <svg
            className="h-12 w-12 text-slate-400 mx-auto mb-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p className="text-sm text-slate-600">{emptyMessage}</p>
          <p className="text-xs text-slate-500 mt-1">Add folders using the form below</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {folders.map((folder, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors"
            >
              <div className="h-8 w-8 rounded bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg
                  className="h-4 w-4 text-emerald-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 font-mono truncate" title={folder}>
                  {folder}
                </p>
              </div>
              <button
                onClick={() => onRemoveFolder(folder)}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors flex-shrink-0"
                title="Remove folder"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Folder Form */}
      <div className="border-t border-slate-200 pt-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Add New Folder
        </label>
        <div className="flex gap-2">
          <Input
            value={newFolderPath}
            onChange={(e) => onNewFolderPathChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 font-mono text-sm"
            onKeyPress={handleKeyPress}
          />
          <Button
            type="button"
            variant="outline"
            onClick={onBrowseFolder}
            className="gap-2 flex-shrink-0"
          >
            <FolderOpen className="h-4 w-4" />
            Browse
          </Button>
          <Button
            onClick={onAddFolder}
            disabled={!newFolderPath.trim()}
            className="gap-2 flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            {addButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
