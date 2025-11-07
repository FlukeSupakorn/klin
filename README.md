# Klin - File Manager UI

A pixel-perfect desktop file management UI built with Vite, React 18, TypeScript, TailwindCSS, and shadcn/ui.

## Features

- 🎨 **Pixel-perfect design** - Matches Figma designs exactly
- 🗂️ **Two main views**:
  - My Files List View - Table layout with file management
  - Secret Folder - Advanced view with carousel, stats, and insights
- 🔄 **Interactive UI** - Tabs, search, checkboxes, filters
- 📊 **File insights** - Charts, stats, and analytics
- 💾 **Mock data** - Zustand store with realistic file data
- 🎯 **Reusable components** - Built with shadcn/ui and Radix UI primitives

## Tech Stack

- **Framework**: Vite + React 18 + TypeScript
- **Styling**: TailwindCSS with Plus Jakarta Sans font
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: lucide-react
- **State Management**: Zustand
- **Routing**: React Router v6
- **Charts**: Recharts
- **Package Manager**: Bun

## Getting Started

### Install Dependencies

```bash
bun install
```

### Run Development Server

```bash
bun run dev
```

Navigate to `http://localhost:1420`

### Build for Production

```bash
bun run build
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (Button, Badge, Input, etc.)
│   ├── layout/          # Sidebar, Header
│   └── file/            # FileIcon, AvatarGroup, PermissionBadge, etc.
├── pages/
│   ├── my-files-page.tsx       # /files route
│   └── secret-folder-page.tsx  # /files/secret route
├── store/
│   └── useFileStore.ts  # Zustand mock data store
├── types/
│   └── file.ts          # TypeScript types
├── lib/
│   └── utils.ts         # Utility functions (cn)
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## Routes

- `/` - Redirects to `/files`
- `/files` - My Files List View (table with 8 files)
- `/files/secret` - Secret Folder (carousel + table + insights sidebar)
- `/tasks` - Placeholder
- `/users` - Placeholder
- `/apis` - Placeholder
- `/subscription` - Placeholder
- `/settings` - Placeholder
- `/help` - Placeholder

## Features by Page

### My Files (`/files`)
- Tab/Grid/List view switcher
- Searchable file table
- Checkbox selection (select all/individual)
- Avatar groups showing users with permissions
- File type icons
- Delete/Edit actions
- Storage progress bar (17.2gb / 20gb used)

### Secret Folder (`/files/secret`)
- Large search bar with Go Pro badge
- Recent Files carousel (5 files)
- Public Files table with permission badges
- Right sidebar with 3 cards:
  - File Details (preview + metadata)
  - File Overview (views, edits, comments, shares, deletes)
  - File Insights (weekly bar chart with trend)

## Mock Data

All data is stored in `src/store/useFileStore.ts`:
- 8 files in My Files (Images, GIFs, Memes, Videos, Documents, Clouds, Work, Important)
- 7 files in Secret Folder with permissions (Editor/View Only/Administrator)
- 4 recent files for carousel
- File stats with weekly insights

## Customization

### Colors
Primary colors are defined in `tailwind.config.ts` and `src/index.css`:
- Primary: indigo-600/700
- Secondary: slate-100/200
- Progress bar: rose-500 to pink-500 gradient

### Fonts
Using Plus Jakarta Sans from Google Fonts (weights: 400, 500, 600, 700, 800)

## License

MIT

