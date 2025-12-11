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
    <div className="flex-1 flex flex-col h-full overflow-hidden">
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
