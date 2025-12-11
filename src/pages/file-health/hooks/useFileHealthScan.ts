import { useState } from 'react'

export function useFileHealthScan() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState('')
  const [hasScanned, setHasScanned] = useState(false)

  const startScan = async () => {
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

  return {
    isScanning,
    scanProgress,
    hasScanned,
    startScan
  }
}
