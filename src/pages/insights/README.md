# AI Insights Page

## Overview
The AI Insights page provides intelligent file organization analysis with a file explorer and AI-generated note previews.

## Structure

```
src/pages/insights/
├── index.tsx                 # Main page component
├── components/
│   └── FileTreeNode.tsx     # Recursive file tree component
└── utils/
    └── fileTree.ts          # File tree utilities and mock data generation
```

## Features

### ✅ Implemented
- **Real Destination Folders**: Uses actual destination folders from settings (`useHomeStore`)
- **Mock File Structure**: AI-generated folder organization with realistic file names
- **Horizontal Scroll**: Featured folders with left/right navigation (3 cards visible)
- **File Explorer**: Tree navigation with expand/collapse
- **Markdown Rendering**: Uses `react-markdown` with prose styling
- **AI Note Preview**: Displays AI-generated summaries for folders and files
- **Empty State**: Shows message when no destination folders configured

### 🚧 Future Implementation: File Preview

#### Supported File Types
The following file types should be supported for preview:

1. **PDF Files** (`.pdf`)
   - Library: `react-pdf` or `@react-pdf-viewer/core`
   - Usage: Display PDF pages with zoom/navigation controls

2. **Excel Files** (`.xlsx`, `.xls`)
   - Library: `sheetjs` (xlsx) + custom table renderer
   - Usage: Parse and display spreadsheet data in tables

3. **Word Documents** (`.docx`, `.doc`)
   - Library: `mammoth` (docx to HTML)
   - Usage: Convert and display formatted document content

4. **Text/Markdown** (`.txt`, `.md`)
   - Already supported via `react-markdown`
   - Usage: Display plain text or rendered markdown

5. **CSV Files** (`.csv`)
   - Library: `papaparse` + table component
   - Usage: Parse and display tabular data

#### Implementation Guide

```typescript
// In handleSelectItem function:
const ext = item.name.split('.').pop()?.toLowerCase()

if (item.isDir) {
  // Show folder note
  const note = await generateFolderNote(item.path, item.name)
  setNotePreview(note)
} else {
  // Check file type and preview accordingly
  switch (ext) {
    case 'pdf':
      // Load and display PDF
      // setPreviewType('pdf')
      // setPdfUrl(item.path)
      break
    
    case 'xlsx':
    case 'xls':
      // Parse and display Excel
      // const data = await parseExcel(item.path)
      // setPreviewType('excel')
      // setExcelData(data)
      break
    
    case 'docx':
    case 'doc':
      // Convert and display Word doc
      // const html = await convertDocx(item.path)
      // setPreviewType('document')
      // setDocumentHtml(html)
      break
    
    case 'txt':
    case 'md':
      // Display text/markdown
      // const content = await readTextFile(item.path)
      // setPreviewType('text')
      // setTextContent(content)
      break
    
    default:
      // Unsupported format - show AI note instead
      const note = await generateFileNote(item.path, item.name)
      setPreviewType('ai-note')
      setNotePreview(note)
  }
}
```

#### Preview Component Structure

```tsx
// Create src/pages/insights/components/FilePreview.tsx

interface FilePreviewProps {
  file: FileNode
  type: 'pdf' | 'excel' | 'document' | 'text' | 'ai-note' | 'unsupported'
  data: any
}

export function FilePreview({ file, type, data }: FilePreviewProps) {
  switch (type) {
    case 'pdf':
      return <PdfViewer url={data.url} />
    case 'excel':
      return <ExcelViewer data={data.sheets} />
    case 'document':
      return <DocumentViewer html={data.html} />
    case 'text':
      return <TextViewer content={data.content} />
    case 'ai-note':
      return <ReactMarkdown>{data.markdown}</ReactMarkdown>
    default:
      return <UnsupportedFileMessage fileName={file.name} />
  }
}
```

## Mock Data

The mock file structure is generated in `utils/fileTree.ts` with:
- AI-organized categories (Reports, Planning, Archive)
- Realistic file names with proper extensions
- Nested folder structure
- File type icons and metadata

## Styling

Uses Tailwind's typography plugin (`prose`) for markdown rendering:
- `prose-headings:text-slate-900` - Dark headings
- `prose-p:text-slate-600` - Muted paragraph text
- `prose-code:text-indigo-600` - Colored inline code
- `prose-code:bg-indigo-50` - Code background

## API Integration

### Current Mock APIs
- `generateFolderNote(path, name)` - AI folder summary
- `generateFileNote(path, name)` - AI file summary
- `getFeaturedFolders(folders)` - Important folder insights

### Real API Requirements
When implementing real AI:
1. Replace mock delay with actual API calls
2. Add authentication/authorization
3. Implement caching for frequently accessed files
4. Add error handling and retry logic
5. Stream large responses for better UX
