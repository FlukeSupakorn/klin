import { useState } from 'react'
import { useFileStore } from '@/store/useFileStore'
import { FileIcon } from '@/components/file/file-icon'
import { PermissionBadge } from '@/components/file/permission-badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Settings, Bell, Filter, Search } from 'lucide-react'

export function HistoryPage() {
  const secretFiles = useFileStore((state) => state.secretFiles)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState(secretFiles[0])

  const filteredFiles = secretFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <span>My Files</span>
              <span>&gt;</span>
              <span className="text-slate-900 font-medium">History</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">File History</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Bell className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search in history..." 
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{filteredFiles.length} Files in History</h2>
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
              {filteredFiles.map((file) => (
                <tr 
                  key={file.id}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${selectedFile?.id === file.id ? 'bg-indigo-50' : ''}`}
                  onClick={() => setSelectedFile(file)}
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
      </div>
    </div>
  )
}
