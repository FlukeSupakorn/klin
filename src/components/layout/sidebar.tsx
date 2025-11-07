import { Link, useLocation } from 'react-router-dom'
import { Home, ListChecks, Users, Database, Settings, HelpCircle, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { icon: Home, label: 'Home', path: '/files', badge: '10' },
  { icon: ListChecks, label: 'Tasks', path: '/tasks' },
  { icon: Users, label: 'Users', path: '/users', badge: '2' },
  { icon: Database, label: 'APIs', path: '/apis' },
  { icon: Database, label: 'Subscription', path: '/subscription' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Help & Support', path: '/help' },
]

export function Sidebar() {
  const location = useLocation()
  
  return (
    <aside className="w-[280px] bg-slate-50 border-r border-slate-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg text-slate-900">slothui</span>
        </div>
      </div>
      
      {/* Search */}
      <div className="px-6 py-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {menuItems.map((item) => {
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
              {item.badge && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      
      {/* Pro Banner */}
      <div className="mx-3 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-2 mb-3">
          <div className="h-6 w-6 rounded bg-amber-400 flex items-center justify-center flex-shrink-0">
            <svg className="h-4 w-4 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2l2.5 5.5L18 8.5l-4.5 4.5L15 19l-5-3-5 3 1.5-6L2 8.5l5.5-1L10 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-700 leading-relaxed">
              Enjoy unlimited access to our app with only a small price monthly.
            </p>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50">
            Dismiss
          </button>
          <button className="flex-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Go Pro
          </button>
        </div>
      </div>
      
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
