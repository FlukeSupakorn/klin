import { useFaqSearch } from './hooks/useFaqSearch'
import { HelpSearchBar } from './components/HelpSearchBar'
import { QuickActions } from './components/QuickActions'
import { FaqList } from './components/FaqList'
import { ContactInfo } from './components/ContactInfo'

export function HelpSupportPage() {
  const {
    searchQuery,
    setSearchQuery,
    selectedFaq,
    setSelectedFaq,
    filteredFaqs,
  } = useFaqSearch()

  const handleToggleFaq = (index: number) => {
    setSelectedFaq(selectedFaq === index ? null : index)
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Help & Support</h1>
          <p className="text-sm text-slate-500 mt-1">Get help with KLIN and contact support</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <HelpSearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <QuickActions />

          <FaqList
            faqs={filteredFaqs}
            selectedFaq={selectedFaq}
            onToggleFaq={handleToggleFaq}
          />

          <ContactInfo />
        </div>
      </div>
    </div>
  )
}

export default HelpSupportPage
