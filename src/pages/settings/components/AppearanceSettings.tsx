import { useTheme, Theme } from '@/context/theme-context'
import { themeConfig } from '@/styles/themes'

const themes: { value: Theme; label: string; description: string }[] = [
  { value: 'klin', label: 'KLIN', description: 'Default brand theme' },
  { value: 'light', label: 'Light', description: 'Clean and bright interface' },
  { value: 'dark', label: 'Dark', description: 'Easy on the eyes' },
  { value: 'blue', label: 'Ocean Blue', description: 'Calm and professional' },
  { value: 'green', label: 'Forest Green', description: 'Fresh and natural' },
  { value: 'purple', label: 'Purple Dream', description: 'Creative and vibrant' },
]

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-theme-text mb-2">Appearance Settings</h2>
      <p className="text-theme-secondary mb-6">Customize the look and feel of your application</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-theme-text mb-4">Color Theme</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((themeOption) => {
              const colors = themeConfig[themeOption.value]
              return (
                <button
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={`p-5 border-2 rounded-xl transition-all text-left ${
                    theme === themeOption.value
                      ? 'border-theme-primary ring-2 ring-opacity-20 shadow-lg'
                      : 'border-theme hover:border-theme-primary hover:shadow-md'
                  }`}
                  style={theme === themeOption.value ? {
                    borderColor: colors.primary,
                    boxShadow: `0 0 0 3px ${colors.primaryLight}`
                  } : undefined}
                >
                  {/* Color Preview */}
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: colors.primary }}
                    />
                    <div 
                      className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: colors.backgroundSecondary }}
                    />
                    <div 
                      className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: colors.accent }}
                    />
                  </div>
                  
                  <div>
                    <div className="font-semibold text-theme-text flex items-center gap-2">
                      {themeOption.label}
                      {theme === themeOption.value && (
                        <svg className="h-4 w-4 text-theme-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-theme-muted mt-1">{themeOption.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Theme Preview */}
        <div className="pt-6 border-t border-theme">
          <h3 className="text-sm font-medium text-theme-text mb-3">Preview</h3>
          <div 
            className="rounded-lg p-6 border-2 transition-all"
            style={{ 
              backgroundColor: themeConfig[theme].backgroundSecondary,
              borderColor: themeConfig[theme].border
            }}
          >
            <div className="space-y-3">
              <button 
                className="px-4 py-2 rounded-lg font-medium text-white transition-colors"
                style={{ 
                  backgroundColor: themeConfig[theme].primary,
                }}
              >
                Primary Button
              </button>
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  backgroundColor: themeConfig[theme].accentLight,
                  color: themeConfig[theme].text
                }}
              >
                <p className="text-sm font-medium">Sample content with accent background</p>
              </div>
              <div style={{ color: themeConfig[theme].textSecondary }}>
                <p className="text-sm">This is how secondary text will appear</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
