import { useState } from 'react'

export function useAutomationSettings() {
  const [autoOrganize, setAutoOrganize] = useState(false)

  return {
    autoOrganize,
    setAutoOrganize,
  }
}
