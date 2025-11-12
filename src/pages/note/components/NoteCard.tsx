import { FileText, Download, Trash2 } from 'lucide-react'
import { NoteItem } from '@/lib/note-api'
import { formatDistanceToNow } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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

  // Custom markdown components with inline styles for theme support
  const markdownComponents = {
    h1: ({ node, ...props }: any) => <h1 style={{ color: 'var(--color-text)' }} {...props} />,
    h2: ({ node, ...props }: any) => <h2 style={{ color: 'var(--color-text)' }} {...props} />,
    h3: ({ node, ...props }: any) => <h3 style={{ color: 'var(--color-text)' }} {...props} />,
    h4: ({ node, ...props }: any) => <h4 style={{ color: 'var(--color-text)' }} {...props} />,
    h5: ({ node, ...props }: any) => <h5 style={{ color: 'var(--color-text)' }} {...props} />,
    h6: ({ node, ...props }: any) => <h6 style={{ color: 'var(--color-text)' }} {...props} />,
    p: ({ node, ...props }: any) => <p style={{ color: 'var(--color-text-secondary)' }} {...props} />,
    strong: ({ node, ...props }: any) => <strong style={{ color: 'var(--color-text)' }} {...props} />,
    em: ({ node, ...props }: any) => <em style={{ color: 'var(--color-text-secondary)' }} {...props} />,
    code: ({ node, inline, ...props }: any) => {
      if (inline) {
        return <code style={{ color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)' }} {...props} />
      }
      return <code style={{ color: 'var(--color-text)' }} {...props} />
    },
    a: ({ node, ...props }: any) => <a style={{ color: 'var(--color-primary)' }} {...props} />,
    li: ({ node, ...props }: any) => <li style={{ color: 'var(--color-text-secondary)' }} {...props} />,
  }

  return (
    <div
      onClick={() => onOpen(note.filename)}
      className="bg-theme-background border border-theme rounded-lg p-4 hover:border-theme-primary-light hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Icon and Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-lg bg-theme-primary-light flex items-center justify-center flex-shrink-0">
          <FileText className="h-5 w-5 text-theme-primary" />
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDownload}
            className="h-8 w-8 rounded-lg hover-bg-theme-secondary flex items-center justify-center transition-colors"
            title="Download note"
          >
            <Download className="h-4 w-4 text-theme-secondary" />
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
      <h3 className="text-base font-semibold text-theme-text mb-2 line-clamp-2">
        {note.title || 'Untitled Note'}
      </h3>

      {/* Markdown Preview */}
      <div className="text-sm mb-3 line-clamp-3 prose prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {previewText}
        </ReactMarkdown>
      </div>

      {/* Date */}
      <div className="text-xs text-theme-muted">
        {formatDistanceToNow(modifiedDate, { addSuffix: true })}
      </div>
    </div>
  )
}
