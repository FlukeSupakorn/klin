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
    <div className="prose prose-slate max-w-none
      prose-headings:font-bold prose-headings:tracking-tight
      prose-h1:text-3xl prose-h1:text-slate-900 prose-h1:mb-4
      prose-h2:text-2xl prose-h2:text-slate-800 prose-h2:mt-8 prose-h2:mb-3
      prose-h3:text-xl prose-h3:text-slate-700 prose-h3:mt-6 prose-h3:mb-2
      prose-p:text-base prose-p:text-slate-600 prose-p:leading-relaxed prose-p:my-3
      prose-strong:text-slate-900 prose-strong:font-semibold
      prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
      prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
      prose-li:text-slate-600 prose-li:my-1
      prose-code:text-indigo-700 prose-code:bg-indigo-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
      prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600
      prose-hr:border-slate-200 prose-hr:my-8
      prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
      prose-img:rounded-lg prose-img:shadow-md">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
