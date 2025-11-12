import { FileIcon } from '@/components/file/file-icon'
import { PermissionBadge } from '@/components/file/permission-badge'
import { openFile } from '@/lib/tauri-api'

interface HistoryTableProps {
  files: any[]
  selectedFile: any
  onSelectFile: (file: any) => void
}

export function HistoryTable({ files, selectedFile, onSelectFile }: HistoryTableProps) {
  const handleOpenFile = async (filePath: string) => {
    try {
      await openFile(filePath)
    } catch (error) {
      console.error('Failed to open file:', error)
    }
  }

  return (
    <div className="bg-theme-background border border-theme rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-theme flex items-center justify-between">
        <h2 className="text-lg font-semibold text-theme-text">{files.length} Files in History</h2>
      </div>
      
      <table className="w-full">
        <thead className="bg-theme-secondary border-b border-theme">
          <tr>
            <th className="py-3 px-6 text-left text-sm font-semibold text-theme-text">File Name</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-theme-text">Last Modified</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-theme-text">Permission</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-theme-text">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-theme">
          {files.map((file) => (
            <tr
              key={file.id}
              className={`hover-bg-theme-secondary cursor-pointer transition-colors ${selectedFile?.id === file.id ? 'bg-theme-primary-light' : ''}`}
              onClick={() => onSelectFile(file)}
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <FileIcon type={file.type} className="h-5 w-5 text-theme-primary" />
                  <div>
                    <div 
                      className="font-medium text-theme-text cursor-pointer hover:text-theme-primary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenFile(file.path)
                      }}
                    >
                      {file.name}
                    </div>
                    <div className="text-sm text-theme-muted">{file.sizeFormatted}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-theme-secondary">{file.lastModifiedFormatted}</td>
              <td className="py-4 px-6">
                {file.permission && <PermissionBadge permission={file.permission} />}
              </td>
              <td className="py-4 px-6">
                <button className="text-theme-muted hover:text-theme-secondary">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
