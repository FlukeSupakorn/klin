import { FileIcon } from '@/components/file/file-icon'
import { FileItem } from '@/lib/tauri-api'
import { openFile } from '@/lib/tauri-api'
import { formatFileSize, formatDate, getFileType } from '../file-list/utils'
import { 
  Clock, 
  HardDrive, 
  FileText, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Folder,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AISearchResultsProps {
  files: FileItem[]
  searchQuery: string
  isSearching?: boolean
  onBack?: () => void
}

// Mock AI explanations based on file type
function getMockExplanation(file: FileItem, searchQuery: string): string {
  const fileType = getFileType(file.name, file.is_dir)
  
  const explanations: Record<string, string[]> = {
    pdf: [
      `This PDF document appears to be relevant to your search for "${searchQuery}". It may contain detailed information, reports, or documentation that matches your query.`,
      `A portable document that could contain the information you're looking for. PDF files often contain formatted text, images, and structured content.`,
      `This document file matches your search criteria. It may include technical specifications, guides, or reference materials.`,
    ],
    image: [
      `This image file matches your search for "${searchQuery}". It could be a photo, screenshot, or graphic design related to your query.`,
      `A visual asset that appears relevant to your search. Images often contain visual information that complements text-based content.`,
      `This visual file may contain graphics, photographs, or illustrations related to what you're looking for.`,
    ],
    video: [
      `This video file could contain footage or recordings related to "${searchQuery}". Videos often provide comprehensive visual explanations.`,
      `A multimedia file that may include relevant video content, tutorials, or recordings matching your search.`,
      `This media file appears to match your query. It may contain visual demonstrations or recorded content.`,
    ],
    audio: [
      `This audio file might contain recordings, music, or spoken content related to "${searchQuery}".`,
      `An audio recording that could include podcasts, voice memos, or music matching your search criteria.`,
      `This sound file may contain audio content relevant to your query.`,
    ],
    document: [
      `This document appears to contain text content related to "${searchQuery}". It may include notes, reports, or written materials.`,
      `A text-based file that could contain detailed written information matching your search.`,
      `This file likely contains editable text content relevant to your query.`,
    ],
    spreadsheet: [
      `This spreadsheet may contain data, calculations, or organized information related to "${searchQuery}".`,
      `A data file that could include tables, charts, or numerical analysis matching your search.`,
      `This file likely contains structured data and calculations relevant to your query.`,
    ],
    code: [
      `This source code file may contain programming logic or scripts related to "${searchQuery}".`,
      `A development file that could include functions, classes, or code implementations matching your search.`,
      `This programming file likely contains technical code relevant to your query.`,
    ],
    archive: [
      `This compressed archive may contain multiple files related to "${searchQuery}".`,
      `A bundled file package that could include various documents and assets matching your search.`,
      `This archive file likely contains a collection of files relevant to your query.`,
    ],
    folder: [
      `This folder may contain files and subfolders related to "${searchQuery}".`,
      `A directory that could include organized content matching your search criteria.`,
      `This folder likely contains relevant files organized by topic or project.`,
    ],
    default: [
      `This file appears to match your search for "${searchQuery}". It may contain relevant content or data.`,
      `A file that matches your search criteria. Review its contents for more detailed information.`,
      `This item appears relevant to your query. Open it to explore its contents.`,
    ],
  }

  const typeExplanations = explanations[fileType] || explanations.default
  // Use consistent index based on file path hash for consistent display
  const hashCode = file.path.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0)
  const index = Math.abs(hashCode) % typeExplanations.length
  return typeExplanations[index]
}

// Get file type category for display
function getFileCategory(fileName: string, isDir: boolean): string {
  const type = getFileType(fileName, isDir)
  const categories: Record<string, string> = {
    pdf: 'PDF Document',
    image: 'Image',
    gif: 'GIF Image',
    video: 'Video',
    audio: 'Audio',
    document: 'Document',
    spreadsheet: 'Spreadsheet',
    code: 'Source Code',
    archive: 'Archive',
    folder: 'Folder',
    text: 'Text File',
    default: 'File',
  }
  return categories[type] || categories.default
}

export function AISearchResults({ files, searchQuery, isSearching, onBack }: AISearchResultsProps) {
  const handleOpenFile = async (filePath: string) => {
    try {
      await openFile(filePath)
    } catch (error) {
      console.error('Failed to open file:', error)
    }
  }

  // Get folder path from full path
  const getFolderPath = (fullPath: string) => {
    const parts = fullPath.split(/[/\\]/)
    parts.pop() // Remove filename
    return parts.slice(-2).join(' / ') // Show last 2 folder levels
  }

  if (isSearching) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-theme-secondary border border-theme rounded-2xl p-6 animate-pulse"
          >
            <div className="flex gap-5">
              <div className="w-14 h-14 bg-theme-tertiary rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-theme-tertiary rounded-lg w-1/3" />
                <div className="h-4 bg-theme-tertiary rounded-lg w-1/4" />
                <div className="space-y-2 mt-4">
                  <div className="h-3 bg-theme-tertiary rounded w-full" />
                  <div className="h-3 bg-theme-tertiary rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-theme-primary/10 rounded-2xl flex items-center justify-center mb-6">
          <Sparkles className="h-10 w-10 text-theme-primary" />
        </div>
        <h3 className="text-xl font-semibold text-theme-text mb-2">No results found</h3>
        <p className="text-theme-secondary max-w-md">
          Try adjusting your search query or use different keywords to find what you're looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-theme-primary/10 rounded-full">
            <Sparkles className="h-4 w-4 text-theme-primary" />
            <span className="text-sm font-medium text-theme-primary">AI Search</span>
          </div>
          <span className="text-sm text-theme-secondary">
            Found {files.length} {files.length === 1 ? 'result' : 'results'} for "{searchQuery}"
          </span>
        </div>
        
        {/* Back to Files button */}
        {onBack && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Files
          </Button>
        )}
      </div>

      {/* Results list */}
      {files.map((file) => (
        <div
          key={file.path}
          onClick={() => handleOpenFile(file.path)}
          className="group relative bg-theme-secondary hover:bg-theme-tertiary border border-theme hover:border-theme-primary/30 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-theme-primary/5"
        >
          <div className="flex gap-5">
            {/* Large file icon */}
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-theme-background rounded-xl flex items-center justify-center border border-theme group-hover:border-theme-primary/30 transition-colors">
                <FileIcon 
                  type={getFileType(file.name, file.is_dir)} 
                  className="h-8 w-8" 
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="min-w-0">
                  {/* File name */}
                  <h3 className="text-lg font-semibold text-theme-text truncate group-hover:text-theme-primary transition-colors">
                    {file.name}
                  </h3>
                  
                  {/* File category badge */}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 bg-theme-primary/10 text-theme-primary text-xs font-medium rounded-full">
                      {getFileCategory(file.name, file.is_dir)}
                    </span>
                  </div>
                </div>

                {/* Open button */}
                <button className="flex-shrink-0 p-2 rounded-lg bg-theme-background border border-theme opacity-0 group-hover:opacity-100 transition-opacity hover:bg-theme-primary hover:text-white hover:border-theme-primary">
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>

              {/* Metadata row */}
              <div className="flex items-center gap-4 text-sm text-theme-muted mb-3">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(file.modified)}
                </span>
                <span className="flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5" />
                  {formatFileSize(file.size)}
                </span>
                <span className="flex items-center gap-1.5 truncate">
                  <Folder className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{getFolderPath(file.path)}</span>
                </span>
              </div>

              {/* AI Explanation */}
              <div className="flex gap-3 p-3 bg-theme-background/50 rounded-xl border border-theme/50">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 bg-gradient-to-br from-theme-primary to-theme-accent rounded-md flex items-center justify-center">
                    <FileText className="h-3 w-3 text-white" />
                  </div>
                </div>
                <p className="text-sm text-theme-secondary leading-relaxed">
                  {getMockExplanation(file, searchQuery)}
                </p>
              </div>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="h-5 w-5 text-theme-primary" />
          </div>
        </div>
      ))}
    </div>
  )
}
