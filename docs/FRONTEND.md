# Frontend Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Routing](#routing)
- [State Management](#state-management)
- [Pages](#pages)
- [Components](#components)
- [Utilities & APIs](#utilities--apis)
- [Styling](#styling)
- [Internationalization](#internationalization)

## Overview

The frontend is built with React 19, TypeScript, and Vite, providing a modern and performant desktop application interface.

### Tech Stack
- **React 19** - Latest React with improved performance
- **TypeScript 5.8** - Type-safe development
- **Vite 7** - Fast build tool and dev server
- **Zustand** - Lightweight state management
- **React Router v6** - Client-side routing
- **Radix UI** - Accessible component primitives
- **TailwindCSS** - Utility-first styling
- **Lucide React** - Icon library

## Architecture

### Project Structure

```
src/
├── components/
│   ├── ui/                          # Radix UI primitives
│   │   ├── button.tsx              # Button component
│   │   ├── checkbox.tsx            # Checkbox component
│   │   ├── dialog.tsx              # Modal dialog
│   │   ├── dropdown-menu.tsx       # Dropdown menu
│   │   ├── switch.tsx              # Toggle switch
│   │   ├── tabs.tsx                # Tabs component
│   │   └── toast.tsx               # Toast notifications
│   └── layout/
│       ├── Sidebar.tsx             # App sidebar navigation
│       └── Header.tsx              # Page headers
│
├── pages/
│   ├── home/                        # Home page
│   │   ├── index.tsx               # Main home component
│   │   ├── components/             # Home-specific components
│   │   │   ├── FolderSection.tsx
│   │   │   ├── DestinationFolders.tsx
│   │   │   └── WatchingFolders.tsx
│   │   └── store/
│   │       └── useHomeStore.ts     # Home state management
│   │
│   ├── insights/                    # Insights page
│   │   ├── index.tsx               # Main insights component
│   │   ├── components/
│   │   │   ├── InsightsHeader.tsx
│   │   │   ├── FeaturedFolders.tsx
│   │   │   ├── FileExplorer.tsx
│   │   │   ├── FileTreeNode.tsx
│   │   │   └── NotePreviewPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useInsights.ts      # Insights business logic
│   │   │   └── useNotePreview.ts   # AI note generation
│   │   └── utils/
│   │       └── fileTree.ts         # File tree utilities
│   │
│   └── notes/                       # Notes page
│       ├── index.tsx               # Main notes component
│       └── components/
│           ├── NotesHeader.tsx
│           ├── NotesList.tsx
│           └── NoteEditor.tsx
│
├── lib/
│   ├── tauri-api.ts                # Tauri command wrappers
│   ├── ai-api.ts                   # AI integration
│   ├── utils.ts                    # Common utilities
│   ├── bytes.ts                    # Byte formatting
│   ├── date.ts                     # Date formatting
│   ├── sanitize.ts                 # Input sanitization
│   └── uuid.ts                     # UUID generation
│
├── i18n/
│   ├── en.json                     # English translations
│   └── th.json                     # Thai translations
│
├── assets/                          # Static assets
├── App.css                         # Global styles
├── App.tsx                         # Main app component
├── main.tsx                        # App entry point
└── vite-env.d.ts                   # TypeScript declarations
```

## Routing

### Router Configuration

```typescript
// src/App.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: <HomePage /> },
      { path: 'insights', element: <InsightsPage /> },
      { path: 'notes', element: <NotesPage /> },
    ],
  },
])
```

### Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Redirect | Redirects to `/home` |
| `/home` | `HomePage` | Folder selection and configuration |
| `/insights` | `InsightsPage` | File explorer with AI insights |
| `/notes` | `NotesPage` | Note management and editing |

## State Management

### Zustand Stores

#### Home Store (`useHomeStore.ts`)

Manages folder configuration with localStorage persistence.

```typescript
interface HomeState {
  // State
  watchingFolders: string[]
  destinationFolders: string[]
  destinationMode: 'any' | 'all'
  
  // Actions
  addWatchingFolder: (folder: string) => void
  removeWatchingFolder: (folder: string) => void
  addDestinationFolder: (folder: string) => void
  removeDestinationFolder: (folder: string) => void
  setDestinationMode: (mode: 'any' | 'all') => void
  clearAllFolders: () => void
}
```

**Persistence:**
- Storage key: `klin-home-storage`
- Persisted fields: `watchingFolders`, `destinationFolders`, `destinationMode`
- Uses `zustand/middleware` persist

**Usage Example:**
```typescript
const { 
  destinationFolders, 
  addDestinationFolder,
  removeDestinationFolder 
} = useHomeStore()

// Add folder
await selectFolder().then(folder => {
  if (folder) addDestinationFolder(folder)
})

// Remove folder
removeDestinationFolder('/path/to/folder')
```

## Pages

### Home Page

**Location:** `src/pages/home/index.tsx`

**Purpose:** Configure watching and destination folders

**Components:**
- `WatchingFolders` - Manage folders to monitor
- `DestinationFolders` - Select target folders for organization
- `DestinationModeToggle` - Switch between "Any" and "All" modes

**Features:**
- Folder selection using Tauri dialog
- Add/remove folders
- Destination mode toggle
- Persistent configuration
- Navigate to Insights page

**State:**
```typescript
const {
  watchingFolders,
  destinationFolders,
  destinationMode,
  addWatchingFolder,
  removeWatchingFolder,
  addDestinationFolder,
  removeDestinationFolder,
  setDestinationMode,
} = useHomeStore()
```

---

### Insights Page

**Location:** `src/pages/insights/index.tsx`

**Purpose:** Browse files and view AI-generated folder insights

**Main Components:**

#### 1. Featured Folders
**Component:** `FeaturedFolders.tsx`

Displays top destination folders with AI insights.

```typescript
interface FeaturedFolder {
  folderPath: string
  folderName: string
  importance: 'high' | 'medium' | 'low'
  fileCount: number
  summary: string
  insights: string[]
}
```

**Features:**
- Horizontal scrolling carousel
- Click to navigate to folder in File Explorer
- Auto-generated AI insights
- Importance indicators (🔥 high, ⚡ medium, 📁 low)
- Refresh button

**Props:**
```typescript
interface FeaturedFoldersProps {
  folders: FolderInsight[]
  isLoading: boolean
  onScrollLeft: () => void
  onScrollRight: () => void
  onRefresh: () => void
  onFolderClick: (folderPath: string) => void
}
```

#### 2. File Explorer
**Component:** `FileExplorer.tsx` + `FileTreeNode.tsx`

Tree view of destination folders and files.

**Features:**
- Recursive file tree rendering
- Expand/collapse folders
- Click folder → select and show AI notes
- Click file → open with system default application
- Auto-expand parent folders when navigating

**File Tree Structure:**
```typescript
interface FileNode {
  name: string
  path: string
  isDir: boolean
  size: number
  modified?: string
  children?: FileNode[]
}
```

**Click Behavior:**
```typescript
const handleClick = async () => {
  if (node.isDir) {
    onToggle(node.path)  // Expand/collapse
    onSelect(node)       // Select and show notes
  } else {
    await openFile(node.path)  // Open with system app
  }
}
```

#### 3. Note Preview Panel
**Component:** `NotePreviewPanel.tsx`

Displays AI-generated notes for selected folder.

**Features:**
- Markdown rendering with syntax highlighting
- Auto-generate notes on folder selection
- Typography styling with `@tailwindcss/typography`
- Empty state when no folder selected

**AI Note Generation:**
```typescript
const generateFolderNote = async (folderPath: string, folderName: string) => {
  const content = await analyzeFolderWithAI(folderPath)
  return {
    title: `AI Overview: ${folderName}`,
    content: content,
    type: 'folder' as const,
    metadata: {
      folderPath,
      generated: new Date().toISOString(),
    }
  }
}
```

**Hooks:**

#### `useInsights.ts`
Manages featured folders and file tree state.

```typescript
export const useFeaturedFolders = () => {
  const [featuredFolders, setFeaturedFolders] = useState<FolderInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const load = async () => {
    // Generate AI insights for destination folders
  }
  
  return { featuredFolders, isLoading, reload: load }
}

export const useFileTree = (destinationFolders: string[]) => {
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  
  const toggleFolder = (path: string) => {
    // Toggle expand/collapse
  }
  
  const navigateToFolder = (folderPath: string) => {
    // Expand path to folder
  }
  
  return { fileTree, expandedFolders, toggleFolder, navigateToFolder, isLoading }
}
```

#### `useNotePreview.ts`
Handles AI note generation for selected items.

```typescript
export const useNotePreview = () => {
  const [notePreview, setNotePreview] = useState<NotePreview | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  
  const handleSelectItem = async (item: FileNode) => {
    if (!item.isDir) return  // Only folders supported
    
    setIsGenerating(true)
    const note = await generateFolderNote(item.path, item.name)
    setNotePreview(note)
    setIsGenerating(false)
  }
  
  return { notePreview, isGenerating, onSelectItem: handleSelectItem }
}
```

**Empty State:**
Shows when no destination folders configured, with button to select folders.

---

### Notes Page

**Location:** `src/pages/notes/index.tsx`

**Purpose:** Create, edit, and manage markdown notes

**Components:**
- `NotesHeader` - Search and create note button
- `NotesList` - List of all notes with metadata
- `NoteEditor` - Markdown editor with live preview

**Features:**
- Create new notes
- Edit existing notes with live markdown preview
- Auto-save functionality
- Delete notes
- Rename notes
- Export/download notes to file system
- Search notes by title/content

**Note Structure:**
```typescript
interface Note {
  filename: string      // Unique filename with timestamp
  title: string        // Note title
  content: string      // Markdown content
  created: string      // Unix timestamp
  modified: string     // Unix timestamp
}
```

**Markdown Editor:**
Uses `@uiw/react-md-editor` for rich editing experience.

```typescript
<MDEditor
  value={content}
  onChange={setContent}
  preview="live"
  height={600}
/>
```

**API Integration:**
```typescript
// Create note
const filename = await createNote(title, content)

// Update note
await updateNote(filename, newContent)

// Delete note
await deleteNote(filename)

// Rename note
const newFilename = await renameNote(oldFilename, newTitle)

// Download note
await downloadNote(filename)  // Opens save dialog
```

## Components

### UI Components (Radix UI)

All UI components are based on Radix UI primitives with TailwindCSS styling.

**Button** (`components/ui/button.tsx`)
```typescript
<Button variant="default" size="md">
  Click Me
</Button>

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon
```

**Dialog** (`components/ui/dialog.tsx`)
```typescript
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

**Toast** (`components/ui/toast.tsx`)
```typescript
import { useToast } from '@/components/ui/use-toast'

const { toast } = useToast()

toast({
  title: 'Success',
  description: 'Operation completed',
  variant: 'default'  // default, destructive
})
```

**Tabs** (`components/ui/tabs.tsx`)
```typescript
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

### Layout Components

**Sidebar** (`components/layout/Sidebar.tsx`)
- Navigation menu
- Route highlighting
- Collapsible sections

**Header** (`components/layout/Header.tsx`)
- Page titles
- Action buttons
- Breadcrumbs

## Utilities & APIs

### Tauri API (`lib/tauri-api.ts`)

Wrappers for Tauri commands to interact with the Rust backend.

#### File Operations

```typescript
// Select folder using native dialog
export const selectFolder = async (): Promise<string | null> => {
  return await open({
    directory: true,
    multiple: false,
  })
}

// Read folder contents
export const readFolder = async (path: string): Promise<FileItem[]> => {
  return await invoke('read_folder', { folderPath: path })
}

// Open file with system default application
export const openFile = async (path: string): Promise<void> => {
  await invoke('open_file', { filePath: path })
}

// Delete file or folder
export const deleteFile = async (path: string): Promise<void> => {
  await invoke('delete_file', { filePath: path })
}

// Create folder
export const createFolder = async (path: string): Promise<void> => {
  await invoke('create_folder', { folderPath: path })
}

// Read file content as string
export const readFileContent = async (path: string): Promise<string> => {
  return await invoke('read_file_content', { filePath: path })
}
```

#### Note Operations

```typescript
// List all notes
export const listNotes = async (): Promise<NoteItem[]> => {
  return await invoke('list_notes')
}

// Create new note
export const createNote = async (
  title: string, 
  content: string
): Promise<string> => {
  return await invoke('create_note', { title, content })
}

// Read note content
export const readNote = async (filename: string): Promise<string> => {
  return await invoke('read_note', { filename })
}

// Update note
export const updateNote = async (
  filename: string, 
  content: string
): Promise<void> => {
  await invoke('update_note', { filename, content })
}

// Delete note
export const deleteNote = async (filename: string): Promise<void> => {
  await invoke('delete_note', { filename })
}

// Rename note
export const renameNote = async (
  oldFilename: string, 
  newTitle: string
): Promise<string> => {
  return await invoke('rename_note', { 
    oldFilename, 
    newTitle 
  })
}

// Download note to file system
export const downloadNote = async (filename: string): Promise<void> => {
  await invoke('download_note', { filename })
}
```

### AI API (`lib/ai-api.ts`)

AI integration for generating folder insights and notes.

```typescript
// Analyze folder and generate insights
export const analyzeFolderWithAI = async (
  folderPath: string
): Promise<string> => {
  // Implementation depends on AI service
  // Returns markdown-formatted insights
}

// Generate folder insight metadata
export const generateFolderInsight = async (
  folderPath: string
): Promise<FolderInsight> => {
  return {
    folderPath,
    folderName: path.basename(folderPath),
    importance: calculateImportance(folderPath),
    fileCount: await getFileCount(folderPath),
    summary: await generateSummary(folderPath),
    insights: await generateInsights(folderPath),
  }
}
```

### Utility Functions

**Common Utils** (`lib/utils.ts`)
```typescript
// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Byte Formatting** (`lib/bytes.ts`)
```typescript
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}
```

**Date Formatting** (`lib/date.ts`)
```typescript
import { format, formatDistanceToNow } from 'date-fns'

export function formatDate(date: Date | string): string {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function formatRelativeTime(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}
```

**Sanitization** (`lib/sanitize.ts`)
```typescript
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9-_\.]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase()
}
```

**UUID** (`lib/uuid.ts`)
```typescript
export function generateUUID(): string {
  return crypto.randomUUID()
}
```

## Styling

### TailwindCSS Configuration

**File:** `tailwind.config.ts`

```typescript
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      typography: {
        // Markdown typography styles
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate'),
  ],
}
```

### Global Styles

**File:** `src/App.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar styles */
.scrollbar-thin::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  @apply bg-slate-100;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  @apply bg-slate-300 rounded;
}
```

### Component Styling Patterns

**Class Name Composition:**
```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  'responsive-classes',
  conditionalClass && 'conditional-classes',
  className  // Allow override from props
)} />
```

## Internationalization

### Translation Files

**English** (`src/i18n/en.json`)
```json
{
  "app": {
    "name": "Klin",
    "tagline": "AI-Powered File Manager"
  },
  "home": {
    "title": "Home",
    "watching": "Watching Folders",
    "destination": "Destination Folders"
  },
  "insights": {
    "title": "Insights",
    "featured": "Featured Folders",
    "explorer": "File Explorer"
  },
  "notes": {
    "title": "Notes",
    "create": "Create Note",
    "edit": "Edit Note"
  }
}
```

**Thai** (`src/i18n/th.json`)
```json
{
  "app": {
    "name": "คลิน",
    "tagline": "ระบบจัดการไฟล์ด้วย AI"
  },
  "home": {
    "title": "หน้าหลัก",
    "watching": "โฟลเดอร์ที่ติดตาม",
    "destination": "โฟลเดอร์ปลายทาง"
  }
}
```

### Usage

```typescript
import en from '@/i18n/en.json'
import th from '@/i18n/th.json'

const translations = { en, th }
const currentLang = 'en'

const t = (key: string) => {
  return key.split('.').reduce((obj, k) => obj?.[k], translations[currentLang])
}

// Usage
<h1>{t('app.name')}</h1>
```

---

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React hooks best practices
- Use functional components
- Implement proper error handling
- Add loading states for async operations

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types
interface Props {
  title: string
}

// 3. Component
export function Component({ title }: Props) {
  // 4. State
  const [state, setState] = useState()
  
  // 5. Handlers
  const handleClick = () => {}
  
  // 6. Render
  return <div>{title}</div>
}
```

### Performance Tips
- Use React.memo for expensive components
- Implement virtualization for long lists
- Lazy load routes and components
- Optimize images and assets
- Use Zustand selectors to prevent unnecessary re-renders

---

[← Back to Main README](../README.md) | [Backend Documentation →](./BACKEND.md)
