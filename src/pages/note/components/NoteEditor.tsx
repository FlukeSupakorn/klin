import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Save, Download, Edit2, Check } from 'lucide-react'
import { useNoteStore } from '../store/useNoteStore'
import { useToast } from '@/components/ui/toast'
import MDEditor from '@uiw/react-md-editor'

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
    <div className="fixed inset-0 bg-theme-background z-50 flex flex-col" data-color-mode="light">
      {/* Header */}
      <div className="border-b border-theme px-6 py-4 bg-theme-background">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
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
                  className="px-4 py-2 border border-theme-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary text-2xl font-bold bg-theme-background text-theme-text"
                  autoFocus
                />
                <button
                  onClick={handleRename}
                  className="h-10 w-10 rounded-lg bg-theme-primary text-white flex items-center justify-center hover-bg-theme-primary-dark"
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsRenaming(false)}
                  className="h-10 w-10 rounded-lg hover-bg-theme-secondary flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 group">
                <h1 className="text-2xl font-bold text-theme-text">
                  {currentNote.title || 'Untitled Note'}
                </h1>
                <button
                  onClick={() => setIsRenaming(true)}
                  className="h-8 w-8 rounded-lg hover-bg-theme-secondary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Rename note"
                >
                  <Edit2 className="h-4 w-4 text-theme-secondary" />
                </button>
              </div>
            )}
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
              className="h-10 w-10 rounded-lg hover-bg-theme-secondary flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-theme-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* WYSIWYG Markdown Editor */}
      <div className="flex-1 overflow-hidden">
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || '')}
          height="100%"
          preview="live"
          hideToolbar={false}
          enableScroll={true}
          visibleDragbar={false}
          className="border-0"
          textareaProps={{
            placeholder: 'Start writing your note...'
          }}
        />
      </div>
    </div>
  )
}
