export type ThemeName = 'klin' | 'light' | 'dark' | 'blue' | 'green' | 'purple'

export interface ThemeColors {
  // Primary colors
  primary: string
  primaryHover: string
  primaryLight: string
  primaryDark: string
  
  // Background colors
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  
  // Text colors
  text: string
  textSecondary: string
  textMuted: string
  
  // Border colors
  border: string
  borderLight: string
  
  // Accent colors
  accent: string
  accentLight: string
  
  // Status colors
  success: string
  warning: string
  error: string
  info: string
}

export const themeConfig: Record<ThemeName, ThemeColors> = {
  // KLIN - Default brand theme (Indigo-based with slate backgrounds)
  klin: {
    primary: '#4F46E5',        // Indigo-600
    primaryHover: '#4338CA',   // Indigo-700
    primaryLight: '#EEF2FF',   // Indigo-50
    primaryDark: '#3730A3',    // Indigo-800
    
    background: '#FFFFFF',
    backgroundSecondary: '#F8FAFC',  // Slate-50
    backgroundTertiary: '#F1F5F9',   // Slate-100
    
    text: '#1E293B',           // Slate-900
    textSecondary: '#475569',  // Slate-600
    textMuted: '#94A3B8',      // Slate-400
    
    border: '#E2E8F0',         // Slate-200
    borderLight: '#F1F5F9',    // Slate-100
    
    accent: '#10B981',         // Emerald-500
    accentLight: '#D1FAE5',    // Emerald-100
    
    success: '#10B981',        // Emerald-500
    warning: '#F59E0B',        // Amber-500
    error: '#EF4444',          // Red-500
    info: '#3B82F6',           // Blue-500
  },
  
  light: {
    primary: '#71717A',        // Zinc-500 - Neutral gray instead of indigo
    primaryHover: '#52525B',   // Zinc-600
    primaryLight: '#F4F4F5',   // Zinc-100
    primaryDark: '#27272A',    // Zinc-800
    
    background: '#FFFFFF',
    backgroundSecondary: '#FAFAFA',  // Zinc-50
    backgroundTertiary: '#F4F4F5',   // Zinc-100
    
    text: '#18181B',           // Zinc-900
    textSecondary: '#52525B',  // Zinc-600
    textMuted: '#A1A1AA',      // Zinc-400
    
    border: '#E4E4E7',         // Zinc-200
    borderLight: '#F4F4F5',    // Zinc-100
    
    accent: '#14B8A6',         // Teal-500 - Pop of color
    accentLight: '#CCFBF1',    // Teal-100
    
    success: '#10B981',        // Emerald-500
    warning: '#F59E0B',        // Amber-500
    error: '#EF4444',          // Red-500
    info: '#3B82F6',           // Blue-500
  },
  
  dark: {
    primary: '#6366F1',        // Indigo-500
    primaryHover: '#818CF8',   // Indigo-400
    primaryLight: '#312E81',   // Indigo-900
    primaryDark: '#4338CA',    // Indigo-700
    
    background: '#0F172A',     // Slate-900
    backgroundSecondary: '#1E293B',  // Slate-800
    backgroundTertiary: '#334155',   // Slate-700
    
    text: '#F1F5F9',           // Slate-100
    textSecondary: '#CBD5E1',  // Slate-300
    textMuted: '#64748B',      // Slate-500
    
    border: '#334155',         // Slate-700
    borderLight: '#475569',    // Slate-600
    
    accent: '#10B981',         // Emerald-500
    accentLight: '#065F46',    // Emerald-800
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  blue: {
    primary: '#0EA5E9',        // Sky-500
    primaryHover: '#0284C7',   // Sky-600
    primaryLight: '#E0F2FE',   // Sky-100
    primaryDark: '#0C4A6E',    // Sky-900
    
    background: '#FFFFFF',
    backgroundSecondary: '#F0F9FF',  // Sky-50
    backgroundTertiary: '#E0F2FE',   // Sky-100
    
    text: '#0C4A6E',           // Sky-900
    textSecondary: '#0369A1',  // Sky-700
    textMuted: '#7DD3FC',      // Sky-300
    
    border: '#BAE6FD',         // Sky-200
    borderLight: '#E0F2FE',    // Sky-100
    
    accent: '#06B6D4',         // Cyan-500
    accentLight: '#CFFAFE',    // Cyan-100
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#0EA5E9',
  },
  
  green: {
    primary: '#10B981',        // Emerald-500
    primaryHover: '#059669',   // Emerald-600
    primaryLight: '#D1FAE5',   // Emerald-100
    primaryDark: '#065F46',    // Emerald-800
    
    background: '#FFFFFF',
    backgroundSecondary: '#F0FDF4',  // Green-50
    backgroundTertiary: '#DCFCE7',   // Green-100
    
    text: '#065F46',           // Emerald-800
    textSecondary: '#047857',  // Emerald-700
    textMuted: '#6EE7B7',      // Emerald-300
    
    border: '#A7F3D0',         // Emerald-200
    borderLight: '#D1FAE5',    // Emerald-100
    
    accent: '#14B8A6',         // Teal-500
    accentLight: '#CCFBF1',    // Teal-100
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  purple: {
    primary: '#A855F7',        // Purple-500
    primaryHover: '#9333EA',   // Purple-600
    primaryLight: '#F3E8FF',   // Purple-100
    primaryDark: '#581C87',    // Purple-900
    
    background: '#FFFFFF',
    backgroundSecondary: '#FAF5FF',  // Purple-50
    backgroundTertiary: '#F3E8FF',   // Purple-100
    
    text: '#581C87',           // Purple-900
    textSecondary: '#7E22CE',  // Purple-700
    textMuted: '#D8B4FE',      // Purple-300
    
    border: '#E9D5FF',         // Purple-200
    borderLight: '#F3E8FF',    // Purple-100
    
    accent: '#EC4899',         // Pink-500
    accentLight: '#FCE7F3',    // Pink-100
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
}

export function applyTheme(themeName: ThemeName) {
  const theme = themeConfig[themeName]
  const root = document.documentElement

  // Apply CSS variables
  root.style.setProperty('--color-primary', theme.primary)
  root.style.setProperty('--color-primary-hover', theme.primaryHover)
  root.style.setProperty('--color-primary-light', theme.primaryLight)
  root.style.setProperty('--color-primary-dark', theme.primaryDark)
  
  root.style.setProperty('--color-background', theme.background)
  root.style.setProperty('--color-background-secondary', theme.backgroundSecondary)
  root.style.setProperty('--color-background-tertiary', theme.backgroundTertiary)
  
  root.style.setProperty('--color-text', theme.text)
  root.style.setProperty('--color-text-secondary', theme.textSecondary)
  root.style.setProperty('--color-text-muted', theme.textMuted)
  
  root.style.setProperty('--color-border', theme.border)
  root.style.setProperty('--color-border-light', theme.borderLight)
  
  root.style.setProperty('--color-accent', theme.accent)
  root.style.setProperty('--color-accent-light', theme.accentLight)
  
  root.style.setProperty('--color-success', theme.success)
  root.style.setProperty('--color-warning', theme.warning)
  root.style.setProperty('--color-error', theme.error)
  root.style.setProperty('--color-info', theme.info)
}
