# Quick Start Guide

## 🚀 Running the Application

The development server should already be running at:
**http://localhost:1420**

If not, run:
```bash
bun run dev
```

## 📁 Available Routes

### Main Routes
- **/** - Auto-redirects to `/files`
- **/files** - My Files List View page
- **/files/secret** - Secret Folder page with insights

### Placeholder Routes
- /tasks
- /users
- /apis
- /subscription
- /settings
- /help

## 🎯 Testing the UI

### My Files Page (`/files`)
1. Click "List View", "Grid View", or "Tab View" tabs (only List is styled currently)
2. Type in the search box to filter files
3. Click checkboxes to select files (individual or "Select All" in header)
4. Observe avatar groups with user initials (e.g., "SC", "MJ", "+3")
5. Notice the storage progress bar at bottom: "17.2gb out of 20gb (80%)"
6. Click "Delete" or "Edit" buttons (currently just console logs)

### Secret Folder Page (`/files/secret`)
1. Search files with the large search bar
2. Scroll through "Recent Files" carousel (4 horizontal cards)
3. Click rows in "Public Files" table to select them
4. Watch the right sidebar update with selected file details
5. See permission badges: green (Editor), gray (View Only), red (Administrator)
6. View file stats: 198 views, 16 edits, 11 comments, 87 shares, 77 deletes
7. Check the bar chart showing weekly insights (Mon-Sun)

## 🎨 Design Highlights

### Colors
- **Primary**: Indigo-600 (#4F46E5)
- **Secondary**: Slate-100 to Slate-900
- **Progress Bar**: Rose-500 to Pink-500 gradient
- **Success (Editor)**: Green-50/700
- **Error (Administrator)**: Rose-50/600
- **Neutral (View Only)**: Slate-100/600

### Typography
- **Font**: Plus Jakarta Sans (Google Fonts)
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700), ExtraBold (800)
- **Headings**: Text-2xl, font-bold
- **Body**: Text-sm, font-medium
- **Labels**: Text-xs, text-slate-500

### Layout
- **Sidebar**: Fixed 280px width, slate-50 background
- **Main Content**: Flex-1 with white background
- **Cards**: Rounded-xl with border-slate-200 and shadow-sm
- **Tables**: Rounded-xl borders with hover:bg-slate-50 rows

## 🔧 Mock Data

All data comes from `src/store/useFileStore.ts`:

### My Files (8 items)
1. Images - 3.8 GB, 7 users
2. GIFs - 7.2 MB, 5 users
3. Memes - 881 MB, 5 users
4. Videos - 1.25 GB, 7 users
5. Documents - 1.2 TB, 7 users
6. Clouds - 115 KB, 4 users
7. Work - 100 KB, 7 users
8. Important - 1.181 MB, 6 users

### Secret Files (7 items)
1. Berseek Vol 32.pdf - 25 MB (Editor)
2. Invoice Dec 23.doc - 44 GB (View Only)
3. Screenshot 22.jpg - 798 TB (Editor)
4. React Component.tsx - 155 KB (Administrator)
5. Landing Page.html - 1.181 MB (Administrator)
6. Website Styles.css - 1,251 TB (Editor)
7. Cheat Codez.txt - 889 KB (View Only)

### Recent Files (4 items)
- filename.txt
- 2028-19-88_do-not-...
- SecretFolder
- filename.t

## ⚡ Performance Tips

- Development mode includes HMR (Hot Module Replacement)
- Press `h` + Enter in terminal for Vite help menu
- Press `r` + Enter to restart the dev server
- Press `q` + Enter to quit

## 🛠️ Customization

### Change Primary Color
Edit `src/index.css` and `tailwind.config.ts`:
```css
--primary: 238.7 83.5% 66.7%; /* indigo-600 */
```

### Add More Files
Edit `src/store/useFileStore.ts` and add to `myFiles` or `secretFiles` arrays

### Modify Layouts
- Sidebar: `src/components/layout/sidebar.tsx`
- Header: `src/components/layout/header.tsx`
- Pages: `src/pages/`

## 🐛 Troubleshooting

### Port Already in Use
If port 1420 is taken, edit `vite.config.ts`:
```ts
server: {
  port: 1420, // Change to another port like 3000
}
```

### TypeScript Errors
Most errors are from missing dependencies. If you see errors after installing, try:
```bash
rm -rf node_modules bun.lockb
bun install
```

### Styles Not Loading
Make sure `src/index.css` is imported in `src/main.tsx`

## 📦 Build for Production

```bash
bun run build
```

Output will be in `dist/` directory.

Preview production build:
```bash
bun run preview
```

## 🎓 Learning Resources

- [Vite Docs](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Lucide Icons](https://lucide.dev/)

---

**Enjoy building!** 🎉
