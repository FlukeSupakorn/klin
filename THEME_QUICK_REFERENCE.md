# Theme Colors - Quick Reference

## 🎨 Available CSS Classes

### Backgrounds
```css
bg-theme-background          /* Main page background (#FFFFFF) */
bg-theme-secondary           /* Cards, panels (#F8FAFC) */
bg-theme-tertiary            /* Nested elements (#F1F5F9) */
bg-theme-primary             /* Primary brand (#4F46E5) */
bg-theme-primary-light       /* Light primary (#EEF2FF) */
bg-theme-accent              /* Accent color (#10B981) */
bg-theme-accent-light        /* Light accent (#D1FAE5) */
```

### Text
```css
text-theme-text              /* Primary text (#1E293B) */
text-theme-secondary         /* Secondary text (#475569) */
text-theme-muted             /* Muted text (#94A3B8) */
text-theme-primary           /* Primary color text (#4F46E5) */
```

### Borders
```css
border-theme                 /* Default border (#E2E8F0) */
border-theme-light           /* Light border (#F1F5F9) */
```

### Buttons (Pre-styled)
```css
btn-theme-primary            /* Primary button with hover */
btn-theme-outline            /* Outline button with hover */
```

### Interactive States
```css
hover-bg-theme-primary       /* Hover: primary color */
hover-bg-theme-secondary     /* Hover: secondary background */
hover-bg-theme-tertiary      /* Hover: tertiary background */
```

### Status Colors
```css
bg-theme-success             /* Success (#10B981) */
bg-theme-warning             /* Warning (#F59E0B) */
bg-theme-error               /* Error (#EF4444) */
bg-theme-info                /* Info (#3B82F6) */

text-theme-success           /* Success text */
text-theme-warning           /* Warning text */
text-theme-error             /* Error text */
text-theme-info              /* Info text */
```

## 🔧 CSS Variables

```css
/* Primary Colors */
--color-primary              /* #4F46E5 */
--color-primary-hover        /* #4338CA */
--color-primary-light        /* #EEF2FF */
--color-primary-dark         /* #3730A3 */

/* Backgrounds */
--color-background           /* #FFFFFF */
--color-background-secondary /* #F8FAFC */
--color-background-tertiary  /* #F1F5F9 */

/* Text */
--color-text                 /* #1E293B */
--color-text-secondary       /* #475569 */
--color-text-muted           /* #94A3B8 */

/* Borders */
--color-border               /* #E2E8F0 */
--color-border-light         /* #F1F5F9 */

/* Accent */
--color-accent               /* #10B981 */
--color-accent-light         /* #D1FAE5 */

/* Status */
--color-success              /* #10B981 */
--color-warning              /* #F59E0B */
--color-error                /* #EF4444 */
--color-info                 /* #3B82F6 */
```

## 💻 TypeScript Hook

```tsx
import { useThemeColors } from '@/hooks/useThemeColors'

function MyComponent() {
  const colors = useThemeColors()
  
  // Access any color:
  colors.primary
  colors.background
  colors.text
  colors.textSecondary
  colors.border
  // etc...
}
```

## 📋 Common Patterns

### Card Component
```tsx
<div className="bg-theme-secondary border border-theme rounded-lg p-6">
  <h3 className="text-lg font-semibold text-theme-text">Title</h3>
  <p className="text-sm text-theme-secondary mt-2">Description</p>
</div>
```

### Button with Hover
```tsx
<button className="btn-theme-primary px-4 py-2 rounded-lg">
  Click me
</button>

<button className="btn-theme-outline px-4 py-2 rounded-lg">
  Secondary
</button>
```

### Input Field
```tsx
<input 
  className="bg-theme-background border border-theme text-theme-text 
             placeholder:text-theme-muted focus:ring-2 ring-theme-primary"
/>
```

### Icon Button
```tsx
<button className="h-10 w-10 rounded-lg border border-theme 
                   flex items-center justify-center hover-bg-theme-secondary">
  <Icon className="h-5 w-5 text-theme-secondary" />
</button>
```

### Section Header
```tsx
<div className="bg-theme-background border-b border-theme px-8 py-6">
  <h1 className="text-3xl font-bold text-theme-text">Page Title</h1>
  <p className="text-sm text-theme-secondary mt-1">Description</p>
</div>
```

### Sidebar
```tsx
<div className="w-64 border-r border-theme p-4 bg-theme-background">
  <button className={`
    w-full flex items-center gap-3 px-4 py-3 rounded-lg
    ${active 
      ? 'bg-theme-primary-light text-theme-primary' 
      : 'text-theme-text hover-bg-theme-secondary'}
  `}>
    <Icon />
    <span>Menu Item</span>
  </button>
</div>
```

### Badge/Tag
```tsx
<span className="bg-theme-primary-light text-theme-primary 
                 px-3 py-1 rounded-full text-xs font-medium">
  Badge
</span>
```

### Alert/Notice
```tsx
<div className="bg-theme-accent-light border border-theme-accent rounded-lg p-4">
  <p className="text-sm text-theme-text">Info message</p>
</div>
```

## 🎯 Migration Shortcuts

```tsx
// BEFORE
className="bg-white"              → bg-theme-background
className="bg-slate-50"           → bg-theme-secondary
className="bg-slate-100"          → bg-theme-tertiary
className="text-slate-900"        → text-theme-text
className="text-slate-600"        → text-theme-secondary
className="text-slate-400"        → text-theme-muted
className="border-slate-200"      → border-theme
className="bg-indigo-600"         → bg-theme-primary
className="text-indigo-600"       → text-theme-primary
className="hover:bg-slate-50"     → hover-bg-theme-secondary
```

## ⚡ Quick Copy-Paste

```tsx
// Page Header
<div className="bg-theme-background border-b border-theme px-8 py-6">
  <h1 className="text-3xl font-bold text-theme-text">Title</h1>
  <p className="text-sm text-theme-secondary mt-1">Description</p>
</div>

// Card
<div className="bg-theme-secondary border border-theme rounded-xl p-6">
  <h3 className="text-lg font-semibold text-theme-text mb-2">Card Title</h3>
  <p className="text-sm text-theme-secondary">Card content</p>
</div>

// Primary Button
<button className="btn-theme-primary px-4 py-2 rounded-lg font-medium">
  Click Me
</button>

// Outline Button
<button className="btn-theme-outline px-4 py-2 rounded-lg font-medium">
  Cancel
</button>

// Icon Button
<button className="h-10 w-10 rounded-lg border border-theme 
                   hover-bg-theme-secondary flex items-center justify-center">
  <Icon className="h-5 w-5 text-theme-secondary" />
</button>

// Input
<input 
  className="w-full bg-theme-background border border-theme rounded-lg 
             px-3 py-2 text-theme-text placeholder:text-theme-muted
             focus:ring-2 ring-theme-primary"
  placeholder="Enter text..."
/>

// List Item (Active)
<button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                   bg-theme-primary-light text-theme-primary">
  <Icon className="h-5 w-5" />
  <span className="font-medium">Active Item</span>
</button>

// List Item (Inactive)
<button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                   text-theme-text hover-bg-theme-secondary">
  <Icon className="h-5 w-5" />
  <span className="font-medium">Item</span>
</button>
```
