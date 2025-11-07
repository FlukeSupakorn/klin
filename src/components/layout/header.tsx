import { Bell, Settings, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title: string
  breadcrumbs?: { label: string; path?: string }[]
  action?: {
    label: string
    icon?: React.ReactNode
    onClick?: () => void
  }
}

export function Header({ title, breadcrumbs = [], action }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
              <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className={index === breadcrumbs.length - 1 ? 'text-indigo-600 font-medium' : ''}>
                    {crumb.label}
                  </span>
                </div>
              ))}
            </nav>
          )}
          
          {/* Title */}
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <Settings className="h-5 w-5 text-slate-600" />
          </button>
          <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
            <Bell className="h-5 w-5 text-slate-600" />
          </button>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">AU</span>
          </div>
          {action && (
            <Button onClick={action.onClick} className="gap-2">
              {action.icon || <Plus className="h-4 w-4" />}
              {action.label}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
