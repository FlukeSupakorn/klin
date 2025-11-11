# Klin - AI-Powered File Manager

A modern desktop file management application with AI-powered insights, built with Tauri, React, and TypeScript.

## 🚀 Features

- 📁 **Smart File Management** - Browse and organize files with an intuitive interface
- 🤖 **AI Insights** - Get AI-generated notes and insights for your folders
- 📝 **Integrated Notes** - Create, edit, and manage markdown notes
- 🏠 **Folder Watching** - Monitor and track important folders
- 🎯 **Featured Folders** - Quick access to your most important directories
- 🎨 **Modern UI** - Clean, responsive interface with Radix UI components
- � **Cross-Platform** - Built with Tauri for Windows, macOS, and Linux

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

This will generate platform-specific installers in `src-tauri/target/release/`

## 📚 Documentation

For detailed information about the architecture and APIs:

- **[Frontend Documentation](./docs/FRONTEND.md)** - React components, state management, routing, and UI details
- **[Backend Documentation](./docs/BACKEND.md)** - Tauri commands, file operations, note management, and Rust APIs

## 🗂️ Project Structure

```
klin/
├── src/                          # Frontend source code
│   ├── components/
│   │   ├── ui/                  # Radix UI components
│   │   └── layout/              # Layout components (Sidebar, Header)
│   ├── pages/
│   │   ├── home/                # Home page with folder selection
│   │   ├── insights/            # AI insights and file explorer
│   │   └── notes/               # Notes management
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

## 🎯 Key Features

### Home Page
- Select watching folders to monitor
- Choose destination folders for organization
- Toggle between "Any" and "All" destination modes
- Persistent folder configuration (saved to localStorage)

### Insights Page
- **Featured Folders** - Quick navigation to important folders with AI insights
- **File Explorer** - Tree view of destination folders with expand/collapse
- **AI Note Preview** - AI-generated overview notes for selected folders
- Files open with system default application

### Notes Page
- Create and edit markdown notes
- Live markdown preview
- Auto-save functionality
- Export notes to file system
- Organized note list with search

## 🔧 Configuration

### Environment Variables
No environment variables required for basic usage.

### Tauri Configuration
Main configuration in `src-tauri/tauri.conf.json`:
- App identifier: `com.klin.app`
- Window size: 1200x800 (default)
- Security: CSP configured for development

## 🌐 Internationalization

The app supports multiple languages:
- English (en)
- Thai (th)

Translation files located in `src/i18n/`

---

For detailed API documentation and implementation details, please refer to:
- [Frontend Documentation](./docs/FRONTEND.md)
- [Backend Documentation](./docs/BACKEND.md)

