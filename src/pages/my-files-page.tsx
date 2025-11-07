import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileIcon } from '@/components/file/file-icon'
import { AvatarGroup } from '@/components/file/avatar-group'
import { StorageProgress } from '@/components/file/storage-progress'
import { useFileStore } from '@/store/useFileStore'

export function MyFilesPage() {
  const { myFiles, selectedFileIds, toggleFileSelection, selectAllFiles, deselectAllFiles, currentView, setCurrentView, storageUsed, storageTotal } = useFileStore()
  const [localSearch, setLocalSearch] = useState('')
  
  const filteredFiles = myFiles.filter(file => 
    file.name.toLowerCase().includes(localSearch.toLowerCase())
  )
  
  const allSelected = selectedFileIds.length === myFiles.length && myFiles.length > 0
  
  return (
    <div className="flex flex-col h-full">
      <Header 
        title="My Files"
        breadcrumbs={[
          { label: 'Home' },
          { label: 'File Manager' },
          { label: 'My Files' },
        ]}
        action={{
          label: 'Upload File',
          icon: <Upload className="h-4 w-4" />,
          onClick: () => console.log('Upload file'),
        }}
      />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* View Tabs and Search */}
          <div className="flex items-center justify-between mb-6">
            <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as 'tab' | 'grid' | 'list')}>
              <TabsList>
                <TabsTrigger value="tab">Tab View</TabsTrigger>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="w-72">
              <Input 
                placeholder="Search..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </div>
          
          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 text-left w-12">
                    <Checkbox 
                      checked={allSelected}
                      onCheckedChange={() => allSelected ? deselectAllFiles() : selectAllFiles()}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <FileIcon type="folder" className="h-4 w-4" />
                      <span>File Name</span>
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span>File Size</span>
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span>User Permission</span>
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span>Last Modified</span>
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredFiles.map((file) => {
                  const isSelected = selectedFileIds.includes(file.id)
                  return (
                    <tr 
                      key={file.id} 
                      className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-indigo-50' : ''}`}
                    >
                      <td className="py-4 px-4">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => toggleFileSelection(file.id)}
                          aria-label={`Select ${file.name}`}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <FileIcon type={file.type} className="h-5 w-5 text-indigo-600" />
                          <span className="font-medium text-slate-900">{file.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">{file.sizeFormatted}</td>
                      <td className="py-4 px-4">
                        <AvatarGroup users={file.users} max={3} />
                      </td>
                      <td className="py-4 px-4 text-sm text-slate-600">{file.lastModifiedFormatted}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <button className="text-sm font-medium text-rose-500 hover:text-rose-600">Delete</button>
                          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Edit</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <StorageProgress used={storageUsed} total={storageTotal} />
    </div>
  )
}
