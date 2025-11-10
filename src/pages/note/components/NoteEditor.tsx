import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Save, Download, Edit2, Check } from 'lucide-react'
import { useNoteStore } from '../store/useNoteStore'
import { useToast } from '@/components/ui/toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function NoteEditor() {
  const currentNote = useNoteStore((state) => state.currentNote)
  const closeEditor = useNoteStore((state) => state.closeEditor)
  const saveNote = useNoteStore((state) => state.saveNote)
  const downloadNoteFile = useNoteStore((state) => state.downloadNoteFile)
  const renameNote = useNoteStore((state) => state.renameNote)
  
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const toast = useToast()

  useEffect(() => {
    if (currentNote) {
      setContent(currentNote.content)
      setNewTitle(currentNote.title)
    }
  }, [currentNote])

  // Auto-save every 2 seconds when content changes
  useEffect(() => {
    if (!currentNote) return

    const timer = setTimeout(() => {
      if (content !== currentNote.content) {
        handleSave(false) // Silent save without toast
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [content, currentNote])

  const handleSave = async (showToast = true) => {
    if (!currentNote) return

    setIsSaving(true)
    try {
      await saveNote(currentNote.filename, content)
      if (showToast) {
        toast.success('Note Saved', 'Your note has been saved successfully')
      }
    } catch (error) {
      toast.error('Save Failed', 'Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = async () => {
    if (!currentNote) return

    try {
      await downloadNoteFile(currentNote.filename)
      toast.success('Note Downloaded', 'Note exported successfully')
    } catch (error) {
      toast.error('Download Failed', 'Failed to download note')
    }
  }

  const handleClose = () => {
    if (content !== currentNote?.content) {
      if (window.confirm('You have unsaved changes. Save before closing?')) {
        handleSave()
      }
    }
    closeEditor()
  }

  const handleRename = async () => {
    if (!currentNote || !newTitle.trim()) return

    try {
      await renameNote(currentNote.filename, newTitle.trim())
      setIsRenaming(false)
      toast.success('Note Renamed', 'Note renamed successfully')
    } catch (error) {
      toast.error('Rename Failed', 'Failed to rename note')
    }
  }

  if (!currentNote) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename()
                  if (e.key === 'Escape') setIsRenaming(false)
                }}
                className="px-3 py-1.5 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-lg font-semibold"
                autoFocus
              />
              <button
                onClick={handleRename}
                className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsRenaming(false)}
                className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h2 className="text-lg font-semibold text-slate-900">
                {currentNote.title || 'Untitled Note'}
              </h2>
              <button
                onClick={() => setIsRenaming(true)}
                className="h-7 w-7 rounded-lg hover:bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Rename note"
              >
                <Edit2 className="h-3.5 w-3.5 text-slate-600" />
              </button>
            </div>
          )}
          <span className="text-sm text-slate-400">{currentNote.filename}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          
          <Button
            size="sm"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>

          <button
            onClick={handleClose}
            className="h-10 w-10 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden flex">
        {/* Markdown Editor */}
        <div className="flex-1 flex flex-col">
          <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700">Editor</h3>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 p-6 font-mono text-sm resize-none focus:outline-none"
            placeholder="Start writing your note..."
          />
        </div>

        {/* Preview */}
        <div className="flex-1 border-l border-slate-200 flex flex-col">
          <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-medium text-slate-700">Preview</h3>
          </div>
          <div className="flex-1 p-6 overflow-auto prose prose-slate max-w-none">
            {content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            ) : (
              <p className="text-slate-400">Preview will appear here...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
