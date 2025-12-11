import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AutomationSettingsState {
  autoOrganize: boolean
  setAutoOrganize: (value: boolean) => void
  autoScheduling: boolean
  setAutoScheduling: (value: boolean) => void
  autoRemoveDuplicates: boolean
  setAutoRemoveDuplicates: (value: boolean) => void
}

const useAutomationSettingsStore = create<AutomationSettingsState>()(  
  persist(
    (set) => ({
      autoOrganize: false,
      setAutoOrganize: (value) => set({ autoOrganize: value }),
      autoScheduling: false,
      setAutoScheduling: (value) => set({ autoScheduling: value }),
      autoRemoveDuplicates: false,
      setAutoRemoveDuplicates: (value) => set({ autoRemoveDuplicates: value }),
    }),
    {
      name: 'klin-automation-settings',
    }
  )
)

export function useAutomationSettings() {
  const { autoOrganize, setAutoOrganize, autoScheduling, setAutoScheduling, autoRemoveDuplicates, setAutoRemoveDuplicates } = useAutomationSettingsStore()

  return {
    autoOrganize,
    setAutoOrganize,
    autoScheduling,
    setAutoScheduling,
    autoRemoveDuplicates,
    setAutoRemoveDuplicates,
  }
}
