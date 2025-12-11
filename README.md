# Klin - AI-Powered File Manager

A modern desktop file management application with intelligent automation, AI-powered insights, and smart file organization capabilities. Built with Tauri, React, and TypeScript.

## 🚀 Features

### Core Features
- 📁 **Smart File Management** - Browse and organize files with an intuitive interface
- 🔍 **Advanced Search** - Semantic search with Thai language support and instant file filtering
- 🤖 **AI Insights** - Get AI-generated notes and insights for your folders
- 📝 **Integrated Notes** - Create, edit, and manage markdown notes with live preview
- 🏠 **Folder Watching** - Monitor and track important folders
- 🎯 **Featured Folders** - Quick access to your most important directories

### Automation & Intelligence
- ⚡ **Auto-Organize Files** - Automatically categorize and move files to appropriate folders
- 📅 **Auto-Schedule Meetings** - Detect meeting information in documents and add to calendar
- 🔄 **Auto-Remove Duplicates** - Intelligent duplicate file detection and removal with safety logs
- 📊 **Activity Tracking** - Complete history of file operations with approve/reject workflow
- 🗓️ **Calendar Integration** - Built-in calendar for meeting management

### File Health & Organization
- 💊 **File Health Scan** - Deep hash-based duplicate detection
- 🎯 **Smart Duplicate Detection** - Groups duplicate files and shows potential space savings
- 📈 **Storage Analytics** - Visualize storage usage and identify cleanup opportunities
- 🔒 **Privacy Controls** - Exclude specific files and folders from scanning

### User Experience
- 🎨 **Modern UI** - Clean, responsive interface with 6 beautiful themes
- 🌐 **Internationalization** - English and Thai language support
- 🔔 **Smart Notifications** - Action-based notifications with direct navigation
- 📱 **Responsive Design** - Optimized for different screen sizes
- 🌙 **Dark Mode** - Full dark mode support across all themes

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: TailwindCSS + Tailwind Typography
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Markdown**: React Markdown + Remark GFM
- **Markdown Editor**: UIW React MD Editor
- **Date Handling**: date-fns for calendar and scheduling

### Backend
- **Runtime**: Tauri v2 (Rust)
- **File Operations**: Native Rust filesystem APIs
- **Plugins**: tauri-plugin-dialog, tauri-plugin-opener

### Development Tools
- **Package Manager**: Bun
- **Type Checking**: TypeScript 5.8
- **Build Tool**: Vite 7

## 📦 Setup and Start App

### Prerequisites
- [Bun](https://bun.sh/) installed on your system
- [Rust](https://www.rust-lang.org/) installed (for Tauri)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FlukeSupakorn/klin.git
   cd klin
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

### Running the Application

**Start development server:**
```bash
bun tauri dev
```

This will:
- Build the Rust backend
- Start the Vite dev server
- Launch the Tauri application window

### Building for Production

**Create production build:**
```bash
bun tauri build
```

This will generate platform-specific installers in `src-tauri/target/release/`

## 🗂️ Project Structure

```
klin/
├── src/                          # Frontend source code
│   ├── components/
│   │   ├── ui/                  # Radix UI components
│   │   ├── layout/              # Layout components (Sidebar, Header)
│   │   ├── NotificationPanel.tsx # Notification system
│   │   └── SearchBar.tsx        # Advanced search with semantic support
│   ├── pages/
│   │   ├── home/                # Home page with folder selection & search
│   │   ├── insights/            # AI insights and file explorer
│   │   ├── notes/               # Notes management
│   │   ├── activity/            # Activity tracking & history
│   │   ├── calendar/            # Meeting calendar
│   │   ├── file-health/         # Duplicate detection & file health
│   │   └── settings/            # App settings and automation config
│   ├── lib/                     # Utilities and helpers
│   │   ├── tauri-api.ts        # Tauri API wrappers
│   │   ├── ai-api.ts           # AI integration
│   │   └── utils.ts            # Common utilities
│   ├── i18n/                    # Internationalization
│   │   ├── en.json             # English translations
│   │   └── th.json             # Thai translations
│   └── App.tsx                 # Main app component
│
├── src-tauri/                   # Tauri backend (Rust)
│   ├── src/
│   │   ├── lib.rs              # Main entry point
│   │   ├── file_ops.rs         # File system operations
│   │   └── note_ops.rs         # Note management operations
│   ├── Cargo.toml              # Rust dependencies
│   └── tauri.conf.json         # Tauri configuration
│
├── docs/                        # Documentation
│   ├── FRONTEND.md             # Frontend documentation
│   └── BACKEND.md              # Backend documentation
│
└── public/                      # Static assets
```

## 🎯 Key Features in Detail

### Home Page
- **Folder Selection** - Select watching and destination folders
- **Advanced Search** - Floating search bar with semantic Thai support
- **Quick Actions** - ESC to return to file list from search results
- **Persistent Configuration** - All settings saved to localStorage

### File Health Page
- **Deep Scan** - Hash-based duplicate detection across all watched folders
- **Smart Grouping** - Groups identical files and calculates potential savings
- **Auto-Remove** - Optional automatic duplicate removal after scanning
- **Activity Logging** - All removals logged with "Duplicate of" details
- **Safety First** - Always keeps one copy, never deletes originals

### Activity Page
- **Live Queue** - See files being processed in real-time
- **History Tracking** - Complete log of all file operations
- **Action Tags** - Different badges for Approved, Rejected, and Removed items
- **Detailed Context** - Shows before/after names, folders, and duplicate relationships
- **Batch Actions** - Approve All, Reject All, or individual actions

### Calendar Page
- **Meeting Detection** - Automatically detects meetings in documents
- **Smart Scheduling** - Agentic popup to confirm and add meetings
- **Calendar View** - Monthly view with navigation
- **Meeting Details** - Click meetings to view full details

### Settings Page
- **Appearance** - Choose from 6 themes (KLIN, Light, Dark, Blue, Green, Purple)
- **Automation** - Configure auto-organize, auto-schedule, auto-remove duplicates
- **Privacy** - Exclude specific files and folders from scanning
- **Notifications** - Customize notification behavior
- **Language** - English and Thai language support

## ⚙️ Automation Features

### Auto-Organize Files
When enabled, automatically organizes files into categorized folders:
- Images → Images/Photos folder
- Documents → Documents/Work folder
- Videos → Videos/Recordings folder
- Code files → Projects/Code folder

### Auto-Schedule Meetings
When enabled, scans documents for meeting information:
- Detects dates, times, and meeting titles
- Shows confirmation popup before adding to calendar
- Automatically creates calendar events with extracted details

### Auto-Remove Duplicates
When enabled, automatically removes duplicates after scanning:
- Keeps one original copy per duplicate group
- Logs all removals to Activity with "duplicated" tag
- Shows "Found and Removed X duplicates" summary
- System and excluded folders are protected

## 🔔 Notification System

Smart notification panel with:
- **Action-based Navigation** - Click notifications to jump to relevant pages
- **Contextual Actions** - Different actions for different notification types
- **Badge Counter** - Shows unread notification count
- **Clear Options** - Clear individual or all notifications

## 🎨 Theming System

Klin includes a comprehensive theming system with 6 pre-configured themes:

### Available Themes
- **KLIN** (default) - Brand theme with indigo accents
- **Light** - Clean and bright interface
- **Dark** - Easy on the eyes with dark backgrounds
- **Blue** - Ocean blue theme
- **Green** - Forest green theme
- **Purple** - Creative purple theme

### Theme Usage
Users can change themes in **Settings → Appearance**. Developers can use theme colors in three ways:

1. **CSS Classes**: `className="bg-theme-primary text-white"`
2. **Hook**: `const colors = useThemeColors()`
3. **CSS Variables**: `background-color: var(--color-primary)`

Theme preferences are automatically saved and persist across sessions.

## 🌐 Internationalization

The app supports multiple languages:
- **English (en)** - Full interface translation
- **Thai (th)** - Complete Thai language support with semantic search

Translation files located in `src/i18n/`

## 🔧 Configuration

### Environment Variables
No environment variables required for basic usage.

### Tauri Configuration
Main configuration in `src-tauri/tauri.conf.json`:
- App identifier: `com.klin.app`
- Window size: 1200x800 (default)
- Security: CSP configured for development

## 📚 Documentation

For detailed information about the architecture and APIs:

- **[Frontend Documentation](./docs/FRONTEND.md)** - React components, state management, routing, and UI details
- **[Backend Documentation](./docs/BACKEND.md)** - Tauri commands, file operations, note management, and Rust APIs
- **[Theming Guide](./THEMING.md)** - Complete theming guide with examples
- **[Theme Implementation](./THEME_IMPLEMENTATION.md)** - Implementation details
- **[Theme Quick Reference](./THEME_QUICK_REFERENCE.md)** - Quick reference for developers

## 🔐 Privacy & Security

- **Local-First** - All data stored locally on your machine
- **No Cloud Sync** - No data sent to external servers
- **Privacy Controls** - Exclude sensitive files and folders from scanning
- **Safe Operations** - File operations are logged and can be reviewed in Activity

## 🚀 Performance

- **Fast Search** - Instant file filtering with semantic understanding
- **Efficient Scanning** - Hash-based duplicate detection
- **Background Processing** - File operations don't block the UI
- **Optimized Rendering** - React 19 with optimized re-renders

---

**Built with ❤️ by FlukeSupakorn**

For detailed API documentation and implementation details, please refer to the documentation files in the `docs/` directory.

