import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { FileNode } from './FileTreeNode'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface FilePreviewProps {
  file: FileNode
}

export function FilePreview({ file }: FilePreviewProps) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  
  // Image formats
  const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'ico']
  
  // PDF format
  if (ext === 'pdf') {
    return <PDFPreview file={file} />
  }
  
  // Image formats
  if (imageFormats.includes(ext || '')) {
    return <ImagePreview file={file} />
  }
  
  // Video formats
  const videoFormats = ['mp4', 'webm', 'ogg', 'mov']
  if (videoFormats.includes(ext || '')) {
    return <VideoPreview file={file} />
  }
  
  // Audio formats
  const audioFormats = ['mp3', 'wav', 'ogg', 'flac', 'm4a']
  if (audioFormats.includes(ext || '')) {
    return <AudioPreview file={file} />
  }
  
  // Unsupported format
  return <UnsupportedPreview file={file} />
}

// PDF Preview Component
function PDFPreview({ file }: { file: FileNode }) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setLoading(false)
    setError(null)
  }
  
  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error)
    setError('Failed to load PDF file')
    setLoading(false)
  }
  
  const changePage = (offset: number) => {
    setPageNumber((prev) => Math.min(Math.max(1, prev + offset), numPages))
  }
  
  const changeScale = (delta: number) => {
    setScale((prev) => Math.min(Math.max(0.5, prev + delta), 3.0))
  }
  
  // Convert Windows path to file:// URL
  const fileUrl = `file:///${file.path.replace(/\\/g, '/')}`
  
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-slate-600">
            Page {pageNumber} of {numPages || '?'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeScale(-0.2)}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-slate-600 w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeScale(0.2)}
            disabled={scale >= 3.0}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-slate-100 flex items-start justify-center p-4">
        {loading && (
          <div className="space-y-4 w-full max-w-2xl">
            <Skeleton className="h-[800px] w-full" />
          </div>
        )}
        
        {error && (
          <div className="text-center p-8">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-slate-600">
              Try opening the file with a PDF reader application.
            </p>
          </div>
        )}
        
        {!error && (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="shadow-lg"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        )}
      </div>
    </div>
  )
}

// Image Preview Component
function ImagePreview({ file }: { file: FileNode }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [scale, setScale] = useState<number>(1.0)
  
  // Convert Windows path to file:// URL
  const fileUrl = `file:///${file.path.replace(/\\/g, '/')}`
  
  const changeScale = (delta: number) => {
    setScale((prev) => Math.min(Math.max(0.25, prev + delta), 4.0))
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
        <div className="text-sm text-slate-600">
          {file.name}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeScale(-0.25)}
            disabled={scale <= 0.25}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-slate-600 w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeScale(0.25)}
            disabled={scale >= 4.0}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Image Viewer */}
      <div className="flex-1 overflow-auto bg-slate-100 flex items-center justify-center p-4">
        {loading && <Skeleton className="h-96 w-96" />}
        
        {error ? (
          <div className="text-center p-8">
            <p className="text-red-600 mb-2">Failed to load image</p>
            <p className="text-sm text-slate-600">
              The image file may be corrupted or in an unsupported format.
            </p>
          </div>
        ) : (
          <img
            src={fileUrl}
            alt={file.name}
            className="max-w-full max-h-full object-contain shadow-lg"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false)
              setError(true)
            }}
          />
        )}
      </div>
    </div>
  )
}

// Video Preview Component
function VideoPreview({ file }: { file: FileNode }) {
  const fileUrl = `file:///${file.path.replace(/\\/g, '/')}`
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-200 bg-slate-50">
        <div className="text-sm text-slate-600">{file.name}</div>
      </div>
      
      <div className="flex-1 bg-black flex items-center justify-center p-4">
        <video
          src={fileUrl}
          controls
          className="max-w-full max-h-full"
          style={{ maxHeight: '100%' }}
        >
          Your browser does not support video playback.
        </video>
      </div>
    </div>
  )
}

// Audio Preview Component
function AudioPreview({ file }: { file: FileNode }) {
  const fileUrl = `file:///${file.path.replace(/\\/g, '/')}`
  
  return (
    <div className="flex flex-col h-full items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="h-24 w-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-12 w-12 text-indigo-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{file.name}</h3>
          <p className="text-sm text-slate-600">Audio File</p>
        </div>
        
        <audio
          src={fileUrl}
          controls
          className="w-full"
        >
          Your browser does not support audio playback.
        </audio>
      </div>
    </div>
  )
}

// Unsupported File Preview
function UnsupportedPreview({ file }: { file: FileNode }) {
  const ext = file.name.split('.').pop()?.toUpperCase()
  
  return (
    <div className="flex flex-col h-full items-center justify-center p-8 text-center">
      <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="h-12 w-12 text-slate-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{file.name}</h3>
      <p className="text-sm text-slate-600 mb-6">
        Preview not available for {ext} files
      </p>
      
      <div className="space-y-2">
        <Button variant="outline" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          Open with System Application
        </Button>
      </div>
    </div>
  )
}
