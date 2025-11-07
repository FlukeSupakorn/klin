import { useState } from 'react'
import { Upload, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileIcon } from '@/components/file/file-icon'
import { AvatarGroup } from '@/components/file/avatar-group'
import { StorageProgress } from '@/components/file/storage-progress'
import { useFileStore } from '@/store/useFileStore'

export function MyFilesPage() {
  const { myFiles, selectedFileIds, toggleFileSelection, selectAllFiles, deselectAllFiles, currentView, setCurrentView, storageUsed, storageTotal } = useFileStore()
  const [localSearch, setLocalSearch] = useState('')
  const [isOrganizeOpen, setIsOrganizeOpen] = useState(false)
  
  const filteredFiles = myFiles.filter(file => 
    file.name.toLowerCase().includes(localSearch.toLowerCase())
  )
  
  const allSelected = selectedFileIds.length === myFiles.length && myFiles.length > 0
  const selectedFiles = myFiles.filter(file => selectedFileIds.includes(file.id))
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>Home</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>File Manager</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-indigo-600 font-medium">My Files</span>
              </div>
            </nav>
            
            {/* Title */}
            <h1 className="text-2xl font-bold text-slate-900">My Files</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Organize Button with Dialog */}
            <Dialog open={isOrganizeOpen} onOpenChange={setIsOrganizeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" disabled={selectedFileIds.length === 0}>
                  <Sparkles className="h-4 w-4" />
                  Organize
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    Organize Files
                  </DialogTitle>
                  <DialogDescription className="text-base pt-2">
                    Do you want to organize these selected files?
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-medium text-slate-700">Selected files ({selectedFiles.length}):</p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {selectedFiles.map((file) => (
                        <div key={file.id} className="flex items-center gap-3 bg-white rounded-md p-2 border border-slate-200">
                          <FileIcon type={file.type} className="h-4 w-4 text-indigo-600" />
                          <span className="text-sm text-slate-900">{file.name}</span>
                          <span className="text-xs text-slate-500 ml-auto">{file.sizeFormatted}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOrganizeOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      console.log('Organizing files:', selectedFiles)
                      setIsOrganizeOpen(false)
                    }}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
              <svg className="h-5 w-5 text-slate-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
              <svg className="h-5 w-5 text-slate-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">AU</span>
            </div>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>
      </div>
      
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
