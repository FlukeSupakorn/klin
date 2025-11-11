import { FileText } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
    <div className="w-1/2 bg-theme-background border border-theme rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-theme">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-theme-primary" />
          <h2 className="text-lg font-semibold text-theme-text">AI Preview</h2>
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
      <FileText className="h-16 w-16 text-theme-muted mb-4" />
      <p className="text-theme-text font-medium">No item selected</p>
      <p className="text-sm text-theme-secondary mt-2">
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
  const components = {
    // Headings with theme colors
    h1: ({ node, ...props }: any) => (
      <h1 
        style={{ color: 'var(--color-text)' }}
        className="text-3xl font-bold mb-4 mt-6" 
        {...props} 
      />
    ),
    h2: ({ node, ...props }: any) => (
      <h2 
        style={{ color: 'var(--color-text)' }}
        className="text-2xl font-bold mb-3 mt-8" 
        {...props} 
      />
    ),
    h3: ({ node, ...props }: any) => (
      <h3 
        style={{ color: 'var(--color-text)' }}
        className="text-xl font-bold mb-2 mt-6" 
        {...props} 
      />
    ),
    h4: ({ node, ...props }: any) => (
      <h4 
        style={{ color: 'var(--color-text)' }}
        className="text-lg font-semibold mb-2 mt-4" 
        {...props} 
      />
    ),
    h5: ({ node, ...props }: any) => (
      <h5 
        style={{ color: 'var(--color-text)' }}
        className="text-base font-semibold mb-2 mt-4" 
        {...props} 
      />
    ),
    h6: ({ node, ...props }: any) => (
      <h6 
        style={{ color: 'var(--color-text)' }}
        className="text-sm font-semibold mb-2 mt-4" 
        {...props} 
      />
    ),
    
    // Paragraphs with theme colors
    p: ({ node, ...props }: any) => (
      <p 
        style={{ color: 'var(--color-text-secondary)' }}
        className="text-base leading-relaxed my-3" 
        {...props} 
      />
    ),
    
    // Strong/Bold text
    strong: ({ node, ...props }: any) => (
      <strong 
        style={{ color: 'var(--color-text)' }}
        className="font-semibold" 
        {...props} 
      />
    ),
    
    // Emphasis/Italic text
    em: ({ node, ...props }: any) => (
      <em 
        style={{ color: 'var(--color-text-secondary)' }}
        className="italic" 
        {...props} 
      />
    ),
    
    // Links
    a: ({ node, ...props }: any) => (
      <a 
        style={{ color: 'var(--color-primary)' }}
        className="hover:underline no-underline" 
        {...props} 
      />
    ),
    
    // Lists
    ul: ({ node, ...props }: any) => (
      <ul 
        style={{ color: 'var(--color-text-secondary)' }}
        className="list-disc pl-6 my-4" 
        {...props} 
      />
    ),
    ol: ({ node, ...props }: any) => (
      <ol 
        style={{ color: 'var(--color-text-secondary)' }}
        className="list-decimal pl-6 my-4" 
        {...props} 
      />
    ),
    li: ({ node, ...props }: any) => (
      <li 
        style={{ color: 'var(--color-text-secondary)' }}
        className="my-1" 
        {...props} 
      />
    ),
    
    // Code blocks
    code: ({ node, inline, ...props }: any) => {
      if (inline) {
        return (
          <code 
            style={{ 
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-light)'
            }}
            className="px-1.5 py-0.5 rounded text-sm font-mono" 
            {...props} 
          />
        )
      }
      return (
        <code 
          style={{ 
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-background-tertiary)'
          }}
          className="block p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono" 
          {...props} 
        />
      )
    },
    
    // Pre blocks (code block container)
    pre: ({ node, ...props }: any) => (
      <pre 
        style={{ 
          color: 'var(--color-text)',
          backgroundColor: 'var(--color-background-tertiary)'
        }}
        className="p-4 rounded-lg overflow-x-auto my-4" 
        {...props} 
      />
    ),
    
    // Blockquotes
    blockquote: ({ node, ...props }: any) => (
      <blockquote 
        style={{ 
          color: 'var(--color-text-secondary)',
          borderLeftColor: 'var(--color-primary)'
        }}
        className="border-l-4 pl-4 italic my-4" 
        {...props} 
      />
    ),
    
    // Horizontal rule
    hr: ({ node, ...props }: any) => (
      <hr 
        style={{ borderColor: 'var(--color-border)' }}
        className="my-8" 
        {...props} 
      />
    ),
    
    // Tables
    table: ({ node, ...props }: any) => (
      <table 
        style={{ color: 'var(--color-text-secondary)' }}
        className="w-full border-collapse my-4" 
        {...props} 
      />
    ),
    thead: ({ node, ...props }: any) => (
      <thead 
        style={{ 
          color: 'var(--color-text)',
          borderColor: 'var(--color-border)'
        }}
        className="border-b" 
        {...props} 
      />
    ),
    tbody: ({ node, ...props }: any) => (
      <tbody 
        style={{ 
          color: 'var(--color-text-secondary)',
          borderColor: 'var(--color-border)'
        }}
        className="divide-y" 
        {...props} 
      />
    ),
    tr: ({ node, ...props }: any) => (
      <tr {...props} />
    ),
    th: ({ node, ...props }: any) => (
      <th 
        style={{ color: 'var(--color-text)' }}
        className="px-4 py-2 text-left font-semibold" 
        {...props} 
      />
    ),
    td: ({ node, ...props }: any) => (
      <td 
        style={{ color: 'var(--color-text-secondary)' }}
        className="px-4 py-2" 
        {...props} 
      />
    ),
    
    // Images
    img: ({ node, ...props }: any) => (
      <img className="rounded-lg shadow-md my-4" {...props} />
    ),
  }

  return (
    <div className="prose max-w-none">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
