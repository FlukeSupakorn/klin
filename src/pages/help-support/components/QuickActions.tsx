import { MessageCircle, BookOpen, HelpCircle } from 'lucide-react'

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <button className="p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-md transition-all text-left">
        <MessageCircle className="h-8 w-8 text-indigo-600 mb-3" />
        <h3 className="font-semibold text-slate-900 mb-1">Live Chat</h3>
        <p className="text-sm text-slate-500">Chat with our support team</p>
      </button>
      <button className="p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-md transition-all text-left">
        <BookOpen className="h-8 w-8 text-indigo-600 mb-3" />
        <h3 className="font-semibold text-slate-900 mb-1">Documentation</h3>
        <p className="text-sm text-slate-500">Browse our guides</p>
      </button>
      <button className="p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-md transition-all text-left">
        <HelpCircle className="h-8 w-8 text-indigo-600 mb-3" />
        <h3 className="font-semibold text-slate-900 mb-1">FAQs</h3>
        <p className="text-sm text-slate-500">Find quick answers</p>
      </button>
    </div>
  )
}
