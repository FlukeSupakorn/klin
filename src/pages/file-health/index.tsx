import { Search, FolderSearch, CheckCircle2, XCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

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

export function FileHealthPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState('')
  const [hasScanned, setHasScanned] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())

  const mockDuplicates: DuplicateGroup[] = [
    {
      id: 1,
      files: [
        {
          path: 'c:\\Users\\supak\\Downloads\\Senior Project 2025 Project proposal and criteria (3).pdf',
          name: 'Senior Project 2025 Project proposal and criteria (3).pdf',
          size: '2.3 MB',
          folder: 'Downloads'
        },
        {
          path: 'c:\\Users\\supak\\Downloads\\Senior Project 2025 Project proposal and criteria (2).pdf',
          name: 'Senior Project 2025 Project proposal and criteria (2).pdf',
          size: '2.3 MB',
          folder: 'Downloads'
        },
        {
          path: 'c:\\Users\\supak\\Documents\\Senior Project 2025 Project proposal and criteria.pdf',
          name: 'Senior Project 2025 Project proposal and criteria.pdf',
          size: '2.3 MB',
          folder: 'Documents'
        }
      ],
      totalSize: '6.9 MB',
      potentialSavings: '4.6 MB'
    },
    {
      id: 2,
      files: [
        {
          path: 'c:\\Users\\supak\\Downloads\\meeting_notes.txt',
          name: 'meeting_notes.txt',
          size: '15 KB',
          folder: 'Downloads'
        },
        {
          path: 'c:\\Users\\supak\\Documents\\meeting_notes.txt',
          name: 'meeting_notes.txt',
          size: '15 KB',
          folder: 'Documents'
        }
      ],
      totalSize: '30 KB',
      potentialSavings: '15 KB'
    },
    {
      id: 3,
      files: [
        {
          path: 'c:\\Users\\supak\\Downloads\\profile_picture.jpg',
          name: 'profile_picture.jpg',
          size: '856 KB',
          folder: 'Downloads'
        },
        {
          path: 'c:\\Users\\supak\\Pictures\\profile_picture.jpg',
          name: 'profile_picture.jpg',
          size: '856 KB',
          folder: 'Pictures'
        },
        {
          path: 'c:\\Users\\supak\\Desktop\\profile_picture.jpg',
          name: 'profile_picture.jpg',
          size: '856 KB',
          folder: 'Desktop'
        }
      ],
      totalSize: '2.5 MB',
      potentialSavings: '1.7 MB'
    }
  ]

  const handleScan = async () => {
    setIsScanning(true)
    setHasScanned(false)
    
    const steps = [
      'Scanning Downloads folder...',
      'Scanning Documents folder...',
      'Scanning Desktop folder...',
      'Scanning Pictures folder...',
      'Analyzing file hashes...',
      'Detecting duplicates...',
      'Calculating savings...'
    ]

    for (const step of steps) {
      setScanProgress(step)
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    setIsScanning(false)
    setHasScanned(true)
  }

  const toggleFileSelection = (filePath: string) => {
    const newSelection = new Set(selectedFiles)
    if (newSelection.has(filePath)) {
      newSelection.delete(filePath)
    } else {
      newSelection.add(filePath)
    }
    setSelectedFiles(newSelection)
  }

  const totalDuplicates = mockDuplicates.reduce((sum, group) => sum + group.files.length, 0)
  const totalSavings = mockDuplicates.reduce((sum, group) => {
    const mb = parseFloat(group.potentialSavings)
    return sum + (group.potentialSavings.includes('MB') ? mb : mb / 1024)
  }, 0).toFixed(1)

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-theme-background">
      {/* Header */}
      <div className="bg-theme-background border-b border-theme px-8 py-6">
        <div>
          <h1 className="text-3xl font-bold text-theme-text">File Health</h1>
          <p className="text-sm text-theme-secondary mt-1">
            Find and manage duplicate files to free up space
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {!hasScanned ? (
          /* Scan Button View */
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center py-16">
              {/* Big Scan Button */}
              <button
                onClick={handleScan}
                disabled={isScanning}
                className={`relative h-48 w-48 rounded-full flex items-center justify-center transition-all ${
                  isScanning
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 animate-pulse'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 shadow-xl hover:shadow-2xl'
                }`}
              >
                {isScanning ? (
                  <div className="relative">
                    <Search className="h-12 w-12 text-white animate-bounce" />
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 border-t-white animate-spin" />
                  </div>
                ) : (
                  <FolderSearch className="h-12 w-12 text-white" />
                )}
              </button>

              <div className="mt-8 text-center">
                {isScanning ? (
                  <>
                    <h2 className="text-2xl font-bold text-theme-text mb-2">
                      Scanning Files...
                    </h2>
                    <p className="text-theme-secondary animate-pulse">{scanProgress}</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-theme-text mb-2">
                      Scan for Duplicates
                    </h2>
                    <p className="text-theme-secondary">
                      Click to start scanning your watched folders
                    </p>
                  </>
                )}
              </div>

              {/* Info Cards */}
              {!isScanning && (
                <div className="mt-12 grid grid-cols-3 gap-4 w-full">
                  <div className="bg-theme-secondary border border-theme rounded-xl p-4 text-center">
                    <FolderSearch className="h-6 w-6 text-theme-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-theme-text">Deep Scan</p>
                    <p className="text-xs text-theme-secondary mt-1">Hash-based detection</p>
                  </div>
                  <div className="bg-theme-secondary border border-theme rounded-xl p-4 text-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-theme-text">Safe</p>
                    <p className="text-xs text-theme-secondary mt-1">Non-destructive</p>
                  </div>
                  <div className="bg-theme-secondary border border-theme rounded-xl p-4 text-center">
                    <Trash2 className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-theme-text">Free Space</p>
                    <p className="text-xs text-theme-secondary mt-1">Reclaim storage</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Summary */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Scan Complete!</h2>
                  <p className="text-white/90">
                    Found {totalDuplicates} duplicate files across {mockDuplicates.length} groups
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{totalSavings} MB</p>
                  <p className="text-white/90">Potential savings</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between bg-theme-background border border-theme rounded-xl p-4">
              <p className="text-sm text-theme-secondary">
                {selectedFiles.size} files selected
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleScan}>
                  Scan Again
                </Button>
                <Button
                  disabled={selectedFiles.size === 0}
                  className="gap-2"
                  onClick={() => {
                    // Mock delete
                    setSelectedFiles(new Set())
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected
                </Button>
              </div>
            </div>

            {/* Duplicate Groups */}
            <div className="space-y-4">
              {mockDuplicates.map((group) => (
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
                            return;
                          }
                          // Open file in default application
                          window.open(`file:///${file.path}`, '_blank');
                        }}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedFiles.has(file.path)}
                            onChange={() => toggleFileSelection(file.path)}
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
          </div>
        )}
      </div>
    </div>
  )
}

export default FileHealthPage
