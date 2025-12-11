interface DuplicateGroup {
  id: number
  files: Array<{
    path: string
    name: string
    size: string
    folder: string
  }>
  totalSize: string
  potentialSavings: string
}

interface DuplicateFileListProps {
  duplicates: DuplicateGroup[]
  selectedFiles: Set<string>
  onToggleFile: (path: string) => void
}

export function DuplicateFileList({ 
  duplicates, 
  selectedFiles, 
  onToggleFile 
}: DuplicateFileListProps) {
  return (
    <div className="space-y-4">
      {duplicates.map((group) => (
        <div
          key={group.id}
          className="bg-theme-background border border-theme rounded-xl overflow-hidden"
        >
          <div className="bg-theme-secondary/50 px-6 py-3 border-b border-theme">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-theme-text">
                  {group.files[0].name.replace(/\s\(\d+\)/, '')}
                </p>
                <p className="text-xs text-theme-secondary mt-1">
                  {group.files.length} copies • Total: {group.totalSize} • Savings: {group.potentialSavings}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-2">
            {group.files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-theme-secondary/30 rounded-lg hover:bg-theme-secondary transition-colors cursor-pointer"
                onClick={(e) => {
                  // If clicking checkbox, don't open file
                  if ((e.target as HTMLInputElement).type === 'checkbox') {
                    return
                  }
                  // Open file in default application
                  window.open(`file:///${file.path}`, '_blank')
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.path)}
                    onChange={() => onToggleFile(file.path)}
                    className="h-4 w-4 rounded border-theme-tertiary text-theme-primary focus:ring-theme-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-theme-text truncate">{file.name}</p>
                    <p className="text-xs text-theme-muted truncate">{file.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-xs bg-theme-tertiary px-2 py-1 rounded">
                    {file.folder}
                  </span>
                  <span className="text-sm text-theme-secondary">{file.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
