import { useState } from 'react'

export function useSettingsTabs() {
  const [activeTab, setActiveTab] = useState('profile')

  return {
    activeTab,
    setActiveTab,
  }
}
