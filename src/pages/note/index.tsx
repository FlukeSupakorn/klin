import { Button } from '@/components/ui/button'
import { Settings, Bell, Plus, StickyNote } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useNoteStore } from './store/useNoteStore'
import { NoteCard } from './components/NoteCard'
import { NoteEditor } from './components/NoteEditor'
import { useToast } from '@/components/ui/toast'
import { useEffect, useState } from 'react'

export function NotePage() {
  const navigate = useNavigate()
  const toast = useToast()
  
  const notes = useNoteStore((state) => state.notes)
  const isEditing = useNoteStore((state) => state.isEditing)
  const isLoading = useNoteStore((state) => state.isLoading)
  const loadNotes = useNoteStore((state) => state.loadNotes)
  const openNote = useNoteStore((state) => state.openNote)
  const createNewNote = useNoteStore((state) => state.createNewNote)
  const removeNote = useNoteStore((state) => state.removeNote)
  const downloadNoteFile = useNoteStore((state) => state.downloadNoteFile)
  
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  const handleCreateNote = async () => {
    try {
      await createNewNote() // No prompt, opens editor immediately
      toast.success('Note Created', 'New note created successfully')
    } catch (error) {
      toast.error('Create Failed', 'Failed to create note')
    }
  }

  const handleOpenNote = async (filename: string) => {
    try {
      await openNote(filename)
    } catch (error) {
      toast.error('Open Failed', 'Failed to open note')
    }
  }

  const handleDownloadNote = async (filename: string) => {
    try {
      await downloadNoteFile(filename)
      toast.success('Note Downloaded', 'Note exported successfully')
    } catch (error) {
      toast.error('Download Failed', 'Failed to download note')
    }
  }

  const handleDeleteNote = async (filename: string) => {
    try {
      await removeNote(filename)
      toast.success('Note Deleted', 'Note deleted successfully')
    } catch (error) {
      toast.error('Delete Failed', 'Failed to delete note')
    }
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-theme-background">
        {/* Header */}
        <div className="px-8 py-6 border-b border-theme">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-theme-text">Notes</h1>
              <p className="text-sm text-theme-secondary mt-1">
                Create and manage your markdown notes
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                className="h-10 w-10 rounded-lg border border-theme flex items-center justify-center hover-bg-theme-secondary"
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-5 w-5 text-theme-secondary" />
              </button>
              <button className="h-10 w-10 rounded-lg border border-theme flex items-center justify-center hover-bg-theme-secondary">
                <Bell className="h-5 w-5 text-theme-secondary" />
              </button>
              <Button className="gap-2" onClick={handleCreateNote}>
                <Plus className="h-4 w-4" />
                New Note
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary bg-theme-background text-theme-text"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-theme-muted"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-theme-secondary">Loading notes...</div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="bg-theme-secondary border border-theme rounded-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-theme-tertiary mb-4">
                <StickyNote className="h-8 w-8 text-theme-muted" />
              </div>
              <h3 className="text-lg font-medium text-theme-text mb-1">
                {notes.length === 0 ? 'No notes yet' : 'No notes found'}
              </h3>
              <p className="text-sm text-theme-secondary mb-4">
                {notes.length === 0 
                  ? 'Create your first note to get started'
                  : 'Try adjusting your search query'}
              </p>
              {notes.length === 0 && (
                <Button onClick={handleCreateNote} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create First Note
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.filename}
                  note={note}
                  onOpen={handleOpenNote}
                  onDownload={handleDownloadNote}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Note Editor Modal */}
      {isEditing && <NoteEditor />}
    </>
  )
}

export default NotePage
