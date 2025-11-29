import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/toast'
import { useDashboardStore } from '../store/useDashboardStore'

export function useMeetingPopup() {
  const toast = useToast()
  const isFirstTimeSetup = useDashboardStore((state) => state.isFirstTimeSetup)
  
  const [isMeetingPopupOpen, setIsMeetingPopupOpen] = useState(false)

  // Check for mock scheduling popup on mount
  useEffect(() => {
    const shouldShowPopup = localStorage.getItem('klin-mock-scheduling-popup') === 'true'
    if (shouldShowPopup && !isFirstTimeSetup) {
      // Show popup after a short delay to simulate file scanning
      const timer = setTimeout(() => {
        setIsMeetingPopupOpen(true)
        // Clear the flag so it only shows once per session
        localStorage.setItem('klin-mock-scheduling-popup', 'false')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isFirstTimeSetup])

  const closeMeetingPopup = () => {
    setIsMeetingPopupOpen(false)
  }

  const confirmMeeting = () => {
    setIsMeetingPopupOpen(false)
    toast.success('Meeting Confirmed', 'You can view the meeting in your calendar')
  }

  return {
    isMeetingPopupOpen,
    closeMeetingPopup,
    confirmMeeting,
  }
}
