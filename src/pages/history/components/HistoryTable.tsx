import { FileIcon } from '@/components/file/file-icon'
import { PermissionBadge } from '@/components/file/permission-badge'

interface HistoryTableProps {
  files: any[]
  selectedFile: any
  onSelectFile: (file: any) => void
}

export function HistoryTable({ files, selectedFile, onSelectFile }: HistoryTableProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{files.length} Files in History</h2>
      </div>
      
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="py-3 px-6 text-left text-sm font-semibold text-slate-700">File Name</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-slate-700">Last Modified</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-slate-700">Permission</th>
            <th className="py-3 px-6 text-left text-sm font-semibold text-slate-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {files.map((file) => (
            <tr 
              key={file.id}
              className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedFile?.id === file.id ? 'bg-indigo-50' : ''}`}
              onClick={() => onSelectFile(file)}
            >
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <FileIcon type={file.type} className="h-5 w-5 text-indigo-600" />
                  <div>
                    <div className="font-medium text-slate-900">{file.name}</div>
                    <div className="text-sm text-slate-500">{file.sizeFormatted}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-sm text-slate-600">{file.lastModifiedFormatted}</td>
              <td className="py-4 px-6">
                {file.permission && <PermissionBadge permission={file.permission} />}
              </td>
              <td className="py-4 px-6">
                <button className="text-slate-400 hover:text-slate-600">
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
