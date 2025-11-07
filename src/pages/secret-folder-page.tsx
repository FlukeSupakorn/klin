import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileIcon } from '@/components/file/file-icon'
import { PermissionBadge } from '@/components/file/permission-badge'
import { useFileStore } from '@/store/useFileStore'
import { BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts'

export function SecretFolderPage() {
  const { secretFiles, recentFiles, fileStats } = useFileStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFile, setSelectedFile] = useState(secretFiles[0])
  
  const filteredFiles = secretFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Secret Folder"
          breadcrumbs={[
            { label: 'My Files' },
            { label: 'Secret Folder' },
          ]}
        />
        
        <div className="flex-1 overflow-auto p-6">
          {/* Search Bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Input 
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e: any) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button className="h-10 px-4 rounded-lg border border-slate-200 flex items-center gap-2 bg-white hover:bg-slate-50 transition-colors">
              <svg className="h-4 w-4 text-slate-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Badge variant="outline" className="h-10 px-4 flex items-center gap-2 border-indigo-200 bg-indigo-50">
              <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2l2.5 5.5L18 8.5l-4.5 4.5L15 19l-5-3-5 3 1.5-6L2 8.5l5.5-1L10 2z" />
              </svg>
              <span className="text-indigo-700 font-semibold text-sm">Go Pro</span>
            </Badge>
          </div>
          
          {/* Recent Files Carousel */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Recent Files</h2>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <span>Newest First</span>
                <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-5 gap-4">
              {recentFiles.map((file) => (
                <div key={file.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="h-20 bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                    <FileIcon type={file.type} className="h-10 w-10 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900 truncate mb-1">{file.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{file.sizeFormatted}</span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Public Files Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Public Files</h2>
                <span className="text-sm text-slate-500">{secretFiles.length} Total</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-9 px-4 rounded-lg border border-slate-200 flex items-center gap-2 bg-white hover:bg-slate-50 transition-colors">
                  <Plus className="h-4 w-4 text-slate-600" />
                </button>
                <Button size="sm" className="gap-2">
                  <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </Button>
              </div>
            </div>
            
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <FileIcon type="document" className="h-4 w-4" />
                      <span>File Name</span>
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span>Last Modified</span>
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span>File Permission</span>
                      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredFiles.map((file) => (
                  <tr 
                    key={file.id} 
                    onClick={() => setSelectedFile(file)}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedFile?.id === file.id ? 'bg-indigo-50' : ''}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <FileIcon type={file.type} className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="font-medium text-slate-900">{file.name}</p>
                          <p className="text-xs text-slate-500">{file.sizeFormatted}</p>
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
      
      {/* Right Sidebar */}
      <aside className="w-80 bg-slate-50 border-l border-slate-200 flex flex-col overflow-auto">
        <div className="p-6 space-y-6">
          {/* File Details Card */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">File Details</h3>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="h-40 bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                <FileIcon type={selectedFile?.type || 'text'} className="h-16 w-16 text-slate-400" />
              </div>
              
              <div className="text-center mb-4">
                {selectedFile?.permission && (
                  <PermissionBadge permission={selectedFile.permission} />
                )}
              </div>
              
              <h4 className="text-lg font-bold text-slate-900 text-center mb-1">{selectedFile?.name || 'accounts.txt'}</h4>
              <p className="text-sm text-slate-500 text-center mb-4">Modified {selectedFile?.lastModifiedFormatted || '2026/02/15'}</p>
            </div>
          </div>
          
          {/* File Overview Card */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">File Overview</h3>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 text-slate-600">
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm">Total Views</span>
                </div>
                <span className="font-semibold text-slate-900">{fileStats?.totalViews || 198}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 text-slate-600">
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="text-sm">Edits</span>
                </div>
                <span className="font-semibold text-slate-900">{fileStats?.totalEdits || 16}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 text-slate-600">
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-sm">Comments</span>
                </div>
                <span className="font-semibold text-slate-900">{fileStats?.totalComments || 11}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 text-slate-600">
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-sm">Share</span>
                </div>
                <span className="font-semibold text-slate-900">{fileStats?.totalShares || 87}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 text-slate-600">
                  <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="text-sm">Deletes</span>
                </div>
                <span className="font-semibold text-slate-900">{fileStats?.totalDeletes || 77}</span>
              </div>
            </div>
          </div>
          
          {/* File Insights Card */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">File Insights</h3>
              <button className="text-slate-400 hover:text-slate-600">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-900">6,712</span>
                  <div className="flex items-center gap-1 text-green-600">
                    <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-semibold">100% last week</span>
                  </div>
                </div>
              </div>
              
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fileStats?.weeklyInsights || []}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#94a3b8' }}
                    />
                    <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <button className="w-full mt-4 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                See All Insights
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
