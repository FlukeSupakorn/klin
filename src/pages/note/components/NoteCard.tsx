import { FileText, Download, Trash2 } from 'lucide-react'
import { NoteItem } from '@/lib/note-api'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'

interface NoteCardProps {
  note: NoteItem
  onOpen: (filename: string) => void
  onDownload: (filename: string) => void
  onDelete: (filename: string) => void
}

export function NoteCard({ note, onOpen, onDownload, onDelete }: NoteCardProps) {
  // Get preview text (first 150 characters)
  const previewText = note.content.trim().substring(0, 150) + (note.content.length > 150 ? '...' : '')

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`Delete note "${note.title}"?`)) {
      onDelete(note.filename)
    }
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload(note.filename)
  }

  const modifiedDate = new Date(parseInt(note.modified) * 1000)

  return (
    <div
      onClick={() => onOpen(note.filename)}
      className="bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Icon and Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-indigo-600" />
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDownload}
            className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
            title="Download note"
          >
            <Download className="h-4 w-4 text-slate-600" />
          </button>
          <button
            onClick={handleDelete}
            className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors"
            title="Delete note"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2">
        {note.title || 'Untitled Note'}
      </h3>

      {/* Markdown Preview */}
      <div className="text-sm text-slate-600 mb-3 line-clamp-3 prose prose-sm prose-slate max-w-none">
        <ReactMarkdown>{previewText}</ReactMarkdown>
      </div>

      {/* Date */}
      <div className="text-xs text-slate-400">
        {formatDistanceToNow(modifiedDate, { addSuffix: true })}
      </div>
    </div>
  )
}
