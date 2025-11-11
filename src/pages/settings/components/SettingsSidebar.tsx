import { User, Lock, Palette, Globe, BellRing, Sparkles, Code } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'automation', label: 'Automation', icon: Sparkles },
  { id: 'notifications', label: 'Notifications', icon: BellRing },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'developer', label: 'Developer', icon: Code },
]

interface SettingsSidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div className="w-64 border-r border-theme p-4 bg-theme-background">
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-theme-primary-light text-theme-primary'
                  : 'text-theme-text hover-bg-theme-secondary'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
