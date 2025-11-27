import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AutomationSettingsState {
  autoOrganize: boolean
  setAutoOrganize: (value: boolean) => void
}

const useAutomationSettingsStore = create<AutomationSettingsState>()(  
  persist(
    (set) => ({
      autoOrganize: false,
      setAutoOrganize: (value) => set({ autoOrganize: value }),
    }),
    {
      name: 'klin-automation-settings',
    }
  )
)

export function useAutomationSettings() {
  const { autoOrganize, setAutoOrganize } = useAutomationSettingsStore()

  return {
    autoOrganize,
    setAutoOrganize,
  }
}
