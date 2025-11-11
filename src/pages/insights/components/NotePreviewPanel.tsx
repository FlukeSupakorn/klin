import { FileText } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import ReactMarkdown from 'react-markdown'
import { FileNode } from './FileTreeNode'

interface NotePreviewPanelProps {
  selectedItem: FileNode | null
  notePreview: string
  isLoading: boolean
}

export function NotePreviewPanel({
  selectedItem,
  notePreview,
  isLoading,
}: NotePreviewPanelProps) {
  return (
    <div className="w-1/2 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">AI Note Preview</h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {!selectedItem ? (
          <EmptyPreview />
        ) : isLoading ? (
          <PreviewSkeleton />
        ) : (
          <MarkdownPreview content={notePreview} />
        )}
      </div>
    </div>
  )
}

function EmptyPreview() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <FileText className="h-16 w-16 text-slate-300 mb-4" />
      <p className="text-slate-600 font-medium">No item selected</p>
      <p className="text-sm text-slate-500 mt-2">
        Select a file or folder to view AI-generated notes
      </p>
    </div>
  )
}

function PreviewSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="pt-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-full mt-1" />
      </div>
    </div>
  )
}

interface MarkdownPreviewProps {
  content: string
}

function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-700 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
