# Theming System Documentation

## Overview

Klin uses a comprehensive theming system built with CSS Variables, TypeScript types, and React hooks. The system supports 5 pre-configured themes with consistent color palettes.

## Available Themes

- **Light**: Clean and bright interface (Indigo-based)
- **Dark**: Easy on the eyes (Dark slate backgrounds)
- **Blue**: Calm and professional (Sky blue)
- **Green**: Fresh and natural (Emerald green)
- **Purple**: Creative and vibrant (Purple-based)

## Architecture

```
src/
├── styles/
│   ├── themes.ts              # TypeScript theme configuration
│   └── theme-variables.css    # CSS variables and utility classes
├── context/
│   └── theme-context.tsx      # Theme state management
└── hooks/
    └── useThemeColors.ts      # Hook for accessing theme colors
```

## Color Palette

Each theme provides 20 color variables organized into categories:

### Primary Colors
- `primary` - Main brand color
- `primaryHover` - Hover state for primary elements
- `primaryLight` - Light variant of primary
- `primaryDark` - Dark variant of primary

### Background Colors
- `background` - Main background
- `backgroundSecondary` - Secondary surfaces (cards, panels)
- `backgroundTertiary` - Tertiary surfaces (nested elements)

### Text Colors
- `text` - Primary text
- `textSecondary` - Secondary text (descriptions)
- `textMuted` - Muted text (placeholders, hints)

### Border Colors
- `border` - Default border
- `borderLight` - Light border variant

### Accent Colors
- `accent` - Accent color for highlights
- `accentLight` - Light accent variant

### Status Colors
- `success` - Success states
- `warning` - Warning states
- `error` - Error states
- `info` - Info states

## Usage Methods

### Method 1: CSS Utility Classes (Recommended)

Use pre-built utility classes for common patterns:

```tsx
import { Button } from '@/components/ui/button'

function MyComponent() {
  return (
    <div className="bg-theme-background">
      <button className="btn-theme-primary">
        Primary Action
      </button>
      
      <button className="btn-theme-outline">
        Secondary Action
      </button>
      
      <div className="bg-theme-secondary text-theme-text border-theme rounded-lg p-4">
        <h3 className="text-theme-primary">Title</h3>
        <p className="text-theme-secondary">Description text</p>
      </div>
    </div>
  )
}
```

Available utility classes:

**Backgrounds:**
- `.bg-theme-primary`, `.bg-theme-background`, `.bg-theme-secondary`, `.bg-theme-tertiary`
- `.bg-theme-accent`, `.bg-theme-accent-light`
- `.bg-theme-success`, `.bg-theme-warning`, `.bg-theme-error`, `.bg-theme-info`

**Text:**
- `.text-theme-primary`, `.text-theme-text`, `.text-theme-secondary`, `.text-theme-muted`
- `.text-theme-success`, `.text-theme-warning`, `.text-theme-error`, `.text-theme-info`

**Borders:**
- `.border-theme`, `.border-theme-light`

**Buttons:**
- `.btn-theme-primary` - Primary button with hover states
- `.btn-theme-outline` - Outlined button with hover states

**Interactive:**
- `.hover-bg-theme-primary:hover` - Hover background
- `.focus-ring-theme-primary:focus` - Focus ring

### Method 2: useThemeColors Hook

For programmatic color access and dynamic styles:

```tsx
import { useThemeColors } from '@/hooks/useThemeColors'

function MyComponent() {
  const colors = useThemeColors()
  
  return (
    <div style={{ backgroundColor: colors.background }}>
      <h1 style={{ color: colors.primary }}>
        Welcome
      </h1>
      
      <div style={{
        backgroundColor: colors.backgroundSecondary,
        borderColor: colors.border,
        color: colors.text,
        padding: '1rem',
        borderRadius: '0.5rem',
      }}>
        Card content
      </div>
      
      <button style={{
        backgroundColor: colors.primary,
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
      }}>
        {colors.success} {/* Access any color programmatically */}
      </button>
    </div>
  )
}
```

### Method 3: CSS Variables Directly

For custom CSS or advanced use cases:

```tsx
function MyComponent() {
  return (
    <div className="custom-styled">
      Content
    </div>
  )
}

// In your CSS file
.custom-styled {
  background-color: var(--color-background-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 1rem;
}

.custom-styled:hover {
  background-color: var(--color-background-tertiary);
  border-color: var(--color-primary);
}
```

Available CSS variables:
```css
--color-primary
--color-primary-hover
--color-primary-light
--color-primary-dark
--color-background
--color-background-secondary
--color-background-tertiary
--color-text
--color-text-secondary
--color-text-muted
--color-border
--color-border-light
--color-accent
--color-accent-light
--color-success
--color-warning
--color-error
--color-info
```

## Changing Themes

### Using ThemeContext

```tsx
import { useTheme } from '@/context/theme-context'

function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="blue">Blue</option>
      <option value="green">Green</option>
      <option value="purple">Purple</option>
    </select>
  )
}
```

The theme is automatically:
- Saved to localStorage
- Applied to CSS variables via `applyTheme()`
- Persisted across sessions

## Adding New Themes

1. **Define theme colors in `src/styles/themes.ts`:**

```typescript
export const themeConfig: Record<ThemeName, ThemeColors> = {
  // ... existing themes
  orange: {
    primary: '#EA580C',
    primaryHover: '#C2410C',
    primaryLight: '#FED7AA',
    primaryDark: '#7C2D12',
    background: '#FFFFFF',
    backgroundSecondary: '#FFF7ED',
    backgroundTertiary: '#FFEDD5',
    text: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#A8A29E',
    border: '#E7E5E4',
    borderLight: '#F5F5F4',
    accent: '#F97316',
    accentLight: '#FED7AA',
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
    info: '#3B82F6',
  },
}
```

2. **Update ThemeName type:**

```typescript
export type ThemeName = 'light' | 'dark' | 'blue' | 'green' | 'purple' | 'orange'
```

3. **Add to AppearanceSettings:**

```tsx
const themes = [
  // ... existing themes
  { value: 'orange', label: 'Sunset Orange', description: 'Warm and energetic' },
]
```

## Best Practices

1. **Prefer utility classes** for simple, common use cases
2. **Use the hook** when you need programmatic access or dynamic calculations
3. **Use CSS variables** for complex custom components or animations
4. **Always use theme colors** instead of hardcoded values for consistency
5. **Test all themes** when creating new components
6. **Provide hover/focus states** using theme colors for interactive elements

## Example: Complete Component

```tsx
import { useThemeColors } from '@/hooks/useThemeColors'

function FeatureCard({ 
  title, 
  description, 
  icon: Icon,
  onClick 
}: FeatureCardProps) {
  const colors = useThemeColors()
  
  return (
    <button
      onClick={onClick}
      className="
        bg-theme-secondary 
        border-theme 
        hover-bg-theme-tertiary
        focus-ring-theme-primary
        rounded-xl p-6 text-left transition-all
        border-2
      "
    >
      <div 
        className="h-12 w-12 rounded-lg mb-4 flex items-center justify-center"
        style={{ backgroundColor: colors.primaryLight }}
      >
        <Icon className="text-theme-primary" size={24} />
      </div>
      
      <h3 className="text-lg font-semibold text-theme-text mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-theme-secondary">
        {description}
      </p>
    </button>
  )
}
```

## Migration Guide

To migrate existing components to the theme system:

### Before:
```tsx
<div className="bg-white border-slate-200 text-slate-900">
  <button className="bg-indigo-600 text-white hover:bg-indigo-700">
    Click me
  </button>
</div>
```

### After (Method 1 - Utility Classes):
```tsx
<div className="bg-theme-background border-theme text-theme-text">
  <button className="btn-theme-primary">
    Click me
  </button>
</div>
```

### After (Method 2 - Hook):
```tsx
function MyComponent() {
  const colors = useThemeColors()
  
  return (
    <div style={{ 
      backgroundColor: colors.background,
      borderColor: colors.border,
      color: colors.text
    }}>
      <button style={{ 
        backgroundColor: colors.primary,
        color: 'white'
      }}>
        Click me
      </button>
    </div>
  )
}
```

## Troubleshooting

**Theme not applying:**
- Check that `theme-variables.css` is imported in `index.css`
- Verify ThemeProvider wraps your app in `main.tsx`
- Check browser console for errors

**Colors not updating:**
- Ensure you're using theme variables, not hardcoded colors
- Check that `applyTheme()` is being called in theme context
- Clear localStorage if theme seems stuck

**TypeScript errors:**
- Ensure theme name matches `ThemeName` type
- Check that color properties match `ThemeColors` interface
- Verify imports are correct

## Resources

- [CSS Variables MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
