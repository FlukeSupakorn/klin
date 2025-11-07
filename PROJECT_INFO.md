# KLIN File Manager

A modern, pixel-perfect file management application built with React, TypeScript, and TailwindCSS.

## Features

### Pages

- **Home** - Main file manager with three view modes (List, Grid, Tab)
- **History** - View file history and past activities
- **Note** - Create and manage notes (UI mockup)
- **Calendar** - Google Calendar-inspired calendar view with events
- **Subscription** - View and manage subscription plans
- **Settings** - Comprehensive settings with theme customization
- **Help & Support** - FAQ, documentation, and contact support

### Key Features

- **Multiple View Modes**: Switch between List, Grid, and Tab views
- **File Organization**: Select and organize files with AI-powered features
- **Theme System**: 5 beautiful themes (Light, Dark, Ocean Blue, Forest Green, Purple Dream)
- **Storage Management**: Track storage usage with visual progress bars
- **File Permissions**: Editor, View Only, and Administrator badges
- **Responsive UI**: Pixel-perfect design matching Figma specifications

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7.2.2
- **Styling**: TailwindCSS 3.4.18
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: lucide-react
- **State Management**: Zustand
- **Routing**: React Router v6
- **Charts**: Recharts
- **Font**: Plus Jakarta Sans

## Theme System

The application includes a powerful theme system with 5 pre-built themes:

1. **Light** (Default) - Clean and minimal
2. **Dark** - Easy on the eyes
3. **Ocean Blue** - Professional blue tones
4. **Forest Green** - Nature-inspired green
5. **Purple Dream** - Creative purple accents

Themes are stored in localStorage and applied via CSS custom properties for seamless switching.

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── file/            # File-specific components
│   └── layout/          # Layout components (Sidebar, Header)
├── context/
│   └── theme-context.tsx # Theme provider and hook
├── pages/               # All page components
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── lib/                # Utility functions
```

## Getting Started

1. Install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev
   ```

3. Build for production:
   ```bash
   bun run build
   ```

## Navigation Structure

- Home (`/files`) - Main file manager
- History (`/history`) - File history view
- Note (`/note`) - Notes interface
- Calendar (`/calendar`) - Calendar with events
- Subscription (`/subscription`) - Plan management
- Settings (`/settings`) - App settings and themes
- Help & Support (`/help`) - Support resources

## Available Scripts

- `bun run dev` - Start development server on port 1420
- `bun run build` - Build for production
- `bun run tauri dev` - Start Tauri development mode
- `bun run tauri build` - Build Tauri application

## License

MIT
