# AI Insights Page

## Overview
The AI Insights page provides intelligent folder analysis with a file explorer and AI-generated note previews for folders.

## Structure

```
src/pages/insights/
├── index.tsx                    # Main page component
├── components/
│   ├── InsightsHeader.tsx      # Header with folder selection
│   ├── FeaturedFolders.tsx     # Horizontal scroll of destination folders
│   ├── FileExplorer.tsx        # File tree explorer
│   ├── FileTreeNode.tsx        # Recursive file tree node component
│   └── NotePreviewPanel.tsx    # AI notes preview panel
├── hooks/
│   ├── useInsights.ts          # Featured folders & file tree logic
│   └── useNotePreview.ts       # Folder AI notes generation
└── utils/
    └── fileTree.ts             # File tree utilities
```

## Features

### ✅ Current Implementation
- **Real Destination Folders**: Uses actual destination folders from settings (`useHomeStore`)
- **Real File Structure**: Reads actual files from destination folders using Tauri
- **Horizontal Scroll**: Featured folders with left/right navigation (3 cards visible)
- **File Explorer**: Tree navigation with expand/collapse for folders
- **Click to Open Files**: Files open with system default application (like home page)
- **Markdown Rendering**: Uses `react-markdown` with `@tailwindcss/typography`
- **AI Folder Notes**: Displays AI-generated summaries for folders only
- **Empty State**: Shows folder selection when no destination folders configured
- **Persistent Storage**: Destination folders saved to localStorage via Zustand persist

### 📝 Folder-Only Previews

The preview panel now shows:
- **Folders**: AI-generated notes with folder overview and file summaries
- **Files**: Open with system application (no in-app preview)

This approach:
- ✅ Keeps the app fast and lightweight
- ✅ Uses system apps for optimal file viewing
- ✅ Focuses on AI-generated insights for folders
- ✅ Reduces complexity and dependencies

## Styling

Uses Tailwind's typography plugin (`prose`) for markdown rendering:
- `prose-headings:text-slate-900` - Dark headings
- `prose-p:text-slate-600` - Muted paragraph text
- `prose-code:text-indigo-600` - Colored inline code
- `prose-code:bg-indigo-50` - Code background

## API Integration
    
    case 'xlsx':
## API Integration

### Current AI APIs
- `generateFolderNote(path, name)` - AI folder summary with file analysis

### Real API Integration
When implementing with real AI service:
1. Replace mock delay with actual API calls to your AI service
2. Add authentication/authorization
3. Implement caching for frequently accessed folders
4. Add error handling and retry logic
5. Stream large responses for better UX

## User Flow

1. **No Destinations**: Shows empty state with "Select Destination Folder" button
2. **Select Folder**: Opens Tauri folder picker, adds to destination list
3. **Featured Folders**: View destination folders in horizontal scroll
4. **Explore Files**: Click folders to expand/collapse tree
5. **View AI Notes**: Select folder to see AI-generated overview
6. **Open Files**: Click files to open with system default application
