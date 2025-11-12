import { useTheme } from '@/context/theme-context'
import { themeConfig } from '@/styles/themes'

/**
 * Hook to access current theme colors
 * 
 * @example
 * const colors = useThemeColors()
 * <div style={{ color: colors.primary }}>Primary text</div>
 * <div style={{ backgroundColor: colors.background }}>Background</div>
 */
export function useThemeColors() {
  const { theme } = useTheme()
  return themeConfig[theme]
}
