import { useState } from 'react'

export function useAutomationSettings() {
  const [autoOrganize, setAutoOrganize] = useState(false)
  const [autoRename, setAutoRename] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(
    () => localStorage.getItem('klin-first-time-setup') !== 'completed'
  )

  const handleFirstTimeToggle = (checked: boolean) => {
    if (checked) {
      localStorage.removeItem('klin-first-time-setup')
      setIsFirstTime(true)
    } else {
      localStorage.setItem('klin-first-time-setup', 'completed')
      setIsFirstTime(false)
    }
  }

  return {
    autoOrganize,
    setAutoOrganize,
    autoRename,
    setAutoRename,
    isFirstTime,
    handleFirstTimeToggle,
  }
}
