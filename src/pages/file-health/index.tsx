import { useState } from 'react'
import { ScanButton } from './components/ScanButton'
import { InfoCards } from './components/InfoCards'
import { DuplicateWarning } from './components/DuplicateWarning'
import { DuplicateResults } from './components/DuplicateResults'
import { useFileHealthScan } from './hooks/useFileHealthScan'
import { mockDuplicatesDefault, mockDuplicatesAfterScan } from './data/mockDuplicates'

export function FileHealthPage() {
  const { isScanning, scanProgress, hasScanned, startScan } = useFileHealthScan()
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [currentMockData, setCurrentMockData] = useState(mockDuplicatesDefault)

  const handleScan = async () => {
    await startScan()
    // After scan completes, switch to different mock data
    setCurrentMockData(mockDuplicatesAfterScan)
    setSelectedFiles(new Set()) // Clear selections
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

  const handleDeleteSelected = () => {
    // Mock delete
    setSelectedFiles(new Set())
  }

  const totalDuplicates = currentMockData.reduce((sum, group) => sum + group.files.length, 0)
  const totalSavings = currentMockData.reduce((sum, group) => {
    const value = parseFloat(group.potentialSavings)
    if (group.potentialSavings.includes('MB')) {
      return sum + value
    } else if (group.potentialSavings.includes('KB')) {
      return sum + (value / 1024)
    }
    return sum
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
        <div className="max-w-6xl mx-auto">
          {/* Scan Button View - Always shown */}
          <div className={`flex flex-col items-center justify-center ${isScanning ? 'py-32' : 'py-16'} transition-all duration-300`}>
            <ScanButton isScanning={isScanning} onScan={handleScan} />

            <div className="mt-8 text-center">
              {isScanning ? (
                <>
                  <h2 className="text-3xl font-bold text-theme-text mb-2">
                    Scanning Files...
                  </h2>
                  <p className="text-lg text-theme-secondary animate-pulse">{scanProgress}</p>
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

            {/* Info Cards - only show when not scanning and no results */}
            {!isScanning && !hasScanned && (
              <InfoCards />
            )}
          </div>

          {/* Results View - shown below scan button, hidden during scan */}
          {!isScanning && (
            <DuplicateResults
              duplicates={currentMockData}
              totalDuplicates={totalDuplicates}
              totalSavings={totalSavings}
              selectedFiles={selectedFiles}
              onToggleFile={toggleFileSelection}
              onScanAgain={handleScan}
              onDeleteSelected={handleDeleteSelected}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FileHealthPage
