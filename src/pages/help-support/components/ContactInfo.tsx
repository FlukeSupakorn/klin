import { Mail, Phone } from 'lucide-react'

export function ContactInfo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <Mail className="h-8 w-8 text-indigo-600 mb-3" />
        <h3 className="font-semibold text-slate-900 mb-1">Email Support</h3>
        <p className="text-sm text-slate-600 mb-2">Get help via email</p>
        <a href="mailto:support@klin.app" className="text-indigo-600 hover:underline text-sm font-medium">
          support@klin.app
        </a>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <Phone className="h-8 w-8 text-indigo-600 mb-3" />
        <h3 className="font-semibold text-slate-900 mb-1">Phone Support</h3>
        <p className="text-sm text-slate-600 mb-2">Mon-Fri, 9AM-5PM EST</p>
        <a href="tel:+1234567890" className="text-indigo-600 hover:underline text-sm font-medium">
          +1 (234) 567-890
        </a>
      </div>
    </div>
  )
}
