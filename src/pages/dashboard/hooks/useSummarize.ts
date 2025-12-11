import { useNavigate } from 'react-router-dom'
import { FileItem } from '@/lib/tauri-api'
import { generateBatchSummaries, createNoteFromSummaries } from '@/lib/ai-api'
import { createNote } from '@/lib/note-api'
import { useFileStore } from '@/store/useFileStore'
import { useToast } from '@/components/ui/toast'

export function useSummarize() {
  const navigate = useNavigate()
  const { deselectAllFiles } = useFileStore()
  const toast = useToast()

  const handleSummarize = async (selectedFiles: FileItem[]) => {
    try {
      toast.info('AI Processing', 'Analyzing selected files...')
      
      // Generate summaries for selected files
      const filesToSummarize = selectedFiles.map(f => ({ name: f.name, path: f.path }))
      const summaries = await generateBatchSummaries(filesToSummarize)
      
      // Create note from summaries
      const noteTitle = `File Summary - ${new Date().toLocaleDateString()}`
      const { content } = await createNoteFromSummaries(summaries, noteTitle)
      
      // Save note
      await createNote(noteTitle, content)
      
      // Clear selection
      deselectAllFiles()
      
      // Show success toast
      toast.success(
        'Note Created',
        `AI summary of ${selectedFiles.length} files saved to Notes`
      )
      
      // Navigate to notes page
      navigate('/note')
    } catch (error) {
      console.error('Failed to summarize files:', error)
      toast.error('Summarize Failed', 'An error occurred while creating the summary')
    }
  }

  return {
    handleSummarize,
  }
}
