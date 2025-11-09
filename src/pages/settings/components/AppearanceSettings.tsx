import { useTheme, Theme } from '@/context/theme-context'

const themes: { value: Theme; label: string; colors: string[] }[] = [
  { value: 'light', label: 'Light', colors: ['#4F46E5', '#F8FAFC', '#1E293B'] },
  { value: 'dark', label: 'Dark', colors: ['#6366F1', '#0F172A', '#F1F5F9'] },
  { value: 'blue', label: 'Ocean Blue', colors: ['#0EA5E9', '#E0F2FE', '#0C4A6E'] },
  { value: 'green', label: 'Forest Green', colors: ['#10B981', '#D1FAE5', '#065F46'] },
  { value: 'purple', label: 'Purple Dream', colors: ['#A855F7', '#F3E8FF', '#581C87'] },
]

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Appearance Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-4">Theme</label>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => setTheme(themeOption.value)}
                className={`p-4 border-2 rounded-xl transition-all ${
                  theme === themeOption.value
                    ? 'border-indigo-600 ring-2 ring-indigo-100'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-1">
                    {themeOption.colors.map((color, i) => (
                      <div
                        key={i}
                        className="h-6 w-6 rounded-full border border-slate-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">{themeOption.label}</div>
                  {theme === themeOption.value && (
                    <div className="text-sm text-indigo-600 mt-1">Currently active</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <label className="flex items-center gap-3">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
            <span className="text-sm text-slate-700">Use system theme preference</span>
          </label>
        </div>
      </div>
    </div>
  )
}
