import { Link, useLocation } from 'react-router-dom'
import { Home, Activity, StickyNote, Settings, LogOut, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: Home, label: 'Home', path: '/files' },
  { icon: Sparkles, label: 'AI Insights', path: '/insights' },
  { icon: Activity, label: 'Activity', path: '/history' },
  { icon: StickyNote, label: 'Note', path: '/note' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export function Sidebar() {
  const location = useLocation()
  
  return (
    <aside className="w-[280px] bg-theme-secondary border-r border-theme flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-theme">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-lg text-theme-text">KLIN</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 mt-4">{menuItems.map((item) => {
          const isActive = location.pathname === item.path || 
                          (item.path === '/files' && location.pathname.startsWith('/files'))
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "bg-theme-background text-theme-text shadow-sm" 
                  : "text-theme-secondary hover-bg-theme-background hover:text-theme-text"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-theme">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            AU
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-theme-text truncate">Azunyan U. Wu</p>
            <p className="text-xs text-theme-muted">Basic Member</p>
          </div>
          <button className="text-theme-muted hover:text-theme-secondary">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
