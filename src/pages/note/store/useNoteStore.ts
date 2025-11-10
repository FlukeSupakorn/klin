import { create } from 'zustand'
import { NoteItem, listNotes, createNote, readNote, updateNote, deleteNote, downloadNote, renameNote } from '@/lib/note-api'

interface NoteState {
  notes: NoteItem[]
  currentNote: NoteItem | null
  isEditing: boolean
  isLoading: boolean
  
  // Actions
  loadNotes: () => Promise<void>
  openNote: (filename: string) => Promise<void>
  createNewNote: (title?: string) => Promise<void>
  saveNote: (filename: string, content: string) => Promise<void>
  removeNote: (filename: string) => Promise<void>
  renameNote: (oldFilename: string, newTitle: string) => Promise<void>
  downloadNoteFile: (filename: string) => Promise<void>
  closeEditor: () => void
  setEditing: (isEditing: boolean) => void
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  currentNote: null,
  isEditing: false,
  isLoading: false,

  loadNotes: async () => {
    set({ isLoading: true })
    try {
      const notes = await listNotes()
      set({ notes, isLoading: false })
    } catch (error) {
      console.error('Failed to load notes:', error)
      set({ isLoading: false })
    }
  },

  openNote: async (filename: string) => {
    try {
      const content = await readNote(filename)
      const note = get().notes.find(n => n.filename === filename)
      if (note) {
        set({ 
          currentNote: { ...note, content }, 
          isEditing: true 
        })
      }
    } catch (error) {
      console.error('Failed to open note:', error)
      throw error
    }
  },

  createNewNote: async (title?: string) => {
    try {
      const noteTitle = title || 'Untitled Note'
      const initialContent = `# ${noteTitle}\n\nStart writing here...`
      
      const filename = await createNote(noteTitle, initialContent)
      await get().loadNotes()
      
      // Open the newly created note in editor immediately
      const note = get().notes.find(n => n.filename === filename)
      if (note) {
        set({ 
          currentNote: { ...note, content: initialContent }, 
          isEditing: true 
        })
      }
    } catch (error) {
      console.error('Failed to create note:', error)
      throw error
    }
  },

  saveNote: async (filename: string, content: string) => {
    try {
      await updateNote(filename, content)
      await get().loadNotes()
      
      // Update current note
      const note = get().notes.find(n => n.filename === filename)
      if (note && get().currentNote?.filename === filename) {
        set({ 
          currentNote: { ...note, content }
        })
      }
    } catch (error) {
      console.error('Failed to save note:', error)
      throw error
    }
  },

  removeNote: async (filename: string) => {
    try {
      await deleteNote(filename)
      await get().loadNotes()
      
      // Close editor if the deleted note was open
      if (get().currentNote?.filename === filename) {
        set({ currentNote: null, isEditing: false })
      }
    } catch (error) {
      console.error('Failed to delete note:', error)
      throw error
    }
  },

  renameNote: async (oldFilename: string, newTitle: string) => {
    try {
      const newFilename = await renameNote(oldFilename, newTitle)
      await get().loadNotes()
      
      // Update current note if it was renamed
      if (get().currentNote?.filename === oldFilename) {
        const note = get().notes.find(n => n.filename === newFilename)
        if (note) {
          const content = get().currentNote?.content || ''
          set({ 
            currentNote: { ...note, content }
          })
        }
      }
    } catch (error) {
      console.error('Failed to rename note:', error)
      throw error
    }
  },

  downloadNoteFile: async (filename: string) => {
    try {
      await downloadNote(filename)
    } catch (error) {
      console.error('Failed to download note:', error)
      throw error
    }
  },

  closeEditor: () => {
    set({ currentNote: null, isEditing: false })
  },

  setEditing: (isEditing: boolean) => {
    set({ isEditing })
  },
}))
