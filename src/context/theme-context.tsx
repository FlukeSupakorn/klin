import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { applyTheme, type ThemeName } from '@/styles/themes'

export type Theme = ThemeName

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('klin-theme')
    return (saved as Theme) || 'klin'
  })

  useEffect(() => {
    localStorage.setItem('klin-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
    applyTheme(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
