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
    <aside className="w-[280px] bg-slate-50 border-r border-slate-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <span className="font-bold text-lg text-slate-900">KLIN</span>
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
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-600 hover:bg-white hover:text-slate-900"
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
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
            AU
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">Azunyan U. Wu</p>
            <p className="text-xs text-slate-500">Basic Member</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
