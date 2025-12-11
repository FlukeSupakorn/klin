import { Search, FolderSearch } from 'lucide-react'

interface ScanButtonProps {
  isScanning: boolean
  onScan: () => void
}

export function ScanButton({ isScanning, onScan }: ScanButtonProps) {
  return (
    <div className="relative">
      {/* Outer spinning ring */}
      {isScanning && (
        <div className="absolute -inset-4 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
      )}
      
      <button
        onClick={onScan}
        disabled={isScanning}
        className={`relative rounded-full flex items-center justify-center transition-all ${
          isScanning
            ? 'h-64 w-64 bg-gradient-to-br from-blue-500 to-purple-500 animate-pulse scale-110'
            : 'h-48 w-48 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 shadow-xl hover:shadow-2xl'
        }`}
      >
        {isScanning ? (
          <Search className="h-16 w-16 text-white animate-bounce" />
        ) : (
          <FolderSearch className="h-12 w-12 text-white" />
        )}
      </button>
    </div>
  )
}
