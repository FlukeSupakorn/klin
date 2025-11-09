import { useState, useMemo } from 'react'

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

export function useFaqSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    selectedFaq,
    setSelectedFaq,
    filteredFaqs,
  }
}
