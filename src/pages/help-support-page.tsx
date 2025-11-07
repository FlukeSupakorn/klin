import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Bell, Search, MessageCircle, BookOpen, HelpCircle, Mail, Phone } from 'lucide-react'

const faqs = [
  {
    question: 'How do I upload files?',
    answer: 'Click the "Upload File" button in the top right corner of the My Files page, then select files from your device.',
  },
  {
    question: 'What file types are supported?',
    answer: 'KLIN supports all common file types including documents, images, videos, and archives. Maximum file size is 2GB per file.',
  },
  {
    question: 'How do I share files with others?',
    answer: 'Select a file and click the "Share" button. You can then invite people by email and set their permission level.',
  },
  {
    question: 'Can I recover deleted files?',
    answer: 'Yes, deleted files are kept in the trash for 30 days before being permanently deleted.',
  },
  {
    question: 'How do I upgrade my storage?',
    answer: 'Go to the Subscription page and select a plan that fits your needs. You can upgrade or downgrade at any time.',
  },
]

export function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
            <p className="text-sm text-slate-500 mt-1">Get help with KLIN and contact support</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Bell className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search for help..."
                className="pl-12 h-14 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Actions */}
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

          {/* FAQs */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setSelectedFaq(selectedFaq === index ? null : index)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-50"
                  >
                    <span className="font-medium text-slate-900">{faq.question}</span>
                    <svg
                      className={`h-5 w-5 text-slate-400 transition-transform ${selectedFaq === index ? 'rotate-180' : ''}`}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {selectedFaq === index && (
                    <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                      <p className="text-slate-700">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Support</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Email</h3>
                  <p className="text-sm text-slate-500">support@klin.app</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">Phone</h3>
                  <p className="text-sm text-slate-500">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <Input placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                <textarea
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  rows={4}
                  placeholder="Describe your issue..."
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
