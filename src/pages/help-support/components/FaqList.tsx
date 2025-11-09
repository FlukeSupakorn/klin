import { ChevronDown, ChevronUp } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

interface FaqListProps {
  faqs: FaqItem[]
  selectedFaq: number | null
  onToggleFaq: (index: number) => void
}

export function FaqList({ faqs, selectedFaq, onToggleFaq }: FaqListProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onToggleFaq(index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-900">{faq.question}</span>
              {selectedFaq === index ? (
                <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
              )}
            </button>
            {selectedFaq === index && (
              <div className="px-4 pb-4 text-sm text-slate-600 border-t border-slate-200 pt-4">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
