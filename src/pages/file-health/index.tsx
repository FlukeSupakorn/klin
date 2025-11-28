import { useState } from 'react'
import { ScanButton } from './components/ScanButton'
import { InfoCards } from './components/InfoCards'
import { DuplicateWarning } from './components/DuplicateWarning'
import { DuplicateResults } from './components/DuplicateResults'
import { useFileHealthScan } from './hooks/useFileHealthScan'
import { mockDuplicatesDefault, mockDuplicatesAfterScan } from './data/mockDuplicates'
import { useAutomationSettings } from '@/pages/settings/hooks/useAutomationSettings'
import { useActivityStore } from '@/pages/activity/store/useActivityStore'

export function FileHealthPage() {
  const { isScanning, scanProgress, hasScanned, startScan } = useFileHealthScan()
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const { autoRemoveDuplicates } = useAutomationSettings()
  const { logDuplicateRemoval } = useActivityStore()
  // When auto-remove is enabled, start with empty data (no duplicates to show)
  const [currentMockData, setCurrentMockData] = useState(autoRemoveDuplicates ? [] : mockDuplicatesDefault)
  const [removedInfo, setRemovedInfo] = useState<{ count: number; savings: string } | null>(null)

  const handleScan = async () => {
    setRemovedInfo(null) // Reset removed info
    await startScan()
    // After scan completes, switch to different mock data
    const scanResults = mockDuplicatesAfterScan
    setSelectedFiles(new Set()) // Clear selections

    // If auto-remove is enabled, perform mock removal and log to Activity
    if (autoRemoveDuplicates) {
      // Calculate what will be removed before clearing
      const filesToRemove = scanResults.flatMap((group) =>
        group.files.slice(1).map((f) => ({ path: f.path, name: f.name, folder: f.folder }))
      )
      const totalRemoved = filesToRemove.length
      const savedMB = scanResults.reduce((sum, group) => {
        const value = parseFloat(group.potentialSavings)
        if (group.potentialSavings.includes('MB')) {
          return sum + value
        } else if (group.potentialSavings.includes('KB')) {
          return sum + (value / 1024)
        }
        return sum
      }, 0).toFixed(1)

      // Log to Activity
      if (filesToRemove.length > 0) {
        logDuplicateRemoval(filesToRemove)
      }

      // Set removed info for display
      setRemovedInfo({ count: totalRemoved, savings: savedMB })
      // Clear duplicates (they're removed)
      setCurrentMockData([])
    } else {
      setCurrentMockData(scanResults)
    }
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

  const handleAutoRemove = () => {
    // Mock auto removal: remove duplicates leaving one per group
    const filesToRemove = currentMockData.flatMap((group) =>
      group.files.slice(1).map((f) => ({ path: f.path, name: f.name, folder: f.folder }))
    )
    const totalRemoved = filesToRemove.length
    const savedMB = currentMockData.reduce((sum, group) => {
      const value = parseFloat(group.potentialSavings)
      if (group.potentialSavings.includes('MB')) {
        return sum + value
      } else if (group.potentialSavings.includes('KB')) {
        return sum + (value / 1024)
      }
      return sum
    }, 0).toFixed(1)

    // Log to Activity with 'duplicated' tag
    if (filesToRemove.length > 0) {
      logDuplicateRemoval(filesToRemove)
    }

    // Set removed info for display
    setRemovedInfo({ count: totalRemoved, savings: savedMB })
    // Update UI mock: after removal, no duplicates remain
    setCurrentMockData([])
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
          {!isScanning && (hasScanned || currentMockData.length > 0 || removedInfo) && (
            <DuplicateResults
              duplicates={currentMockData}
              totalDuplicates={totalDuplicates}
              totalSavings={totalSavings}
              selectedFiles={selectedFiles}
              onToggleFile={toggleFileSelection}
              onScanAgain={handleScan}
              onDeleteSelected={handleDeleteSelected}
              onAutoRemove={handleAutoRemove}
              autoRemoveEnabled={autoRemoveDuplicates}
              removedInfo={removedInfo}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default FileHealthPage
