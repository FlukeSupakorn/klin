/**
 * Navbar Context
 * 
 * Provides a way for pages to communicate with the TopNavbar.
 * Dashboard can set organize button state, notification count, etc.
 * Other pages can add custom action buttons.
 */

import { createContext, useContext, useState, ReactNode } from 'react'

interface NavbarContextType {
  // Organize button (Dashboard)
  canOrganize: boolean
  setCanOrganize: (can: boolean) => void
  showOrganizeAll: boolean
  setShowOrganizeAll: (show: boolean) => void
  onOrganizeClick: (() => void) | null
  setOnOrganizeClick: (fn: (() => void) | null) => void
  
  // Custom action button (page-specific)
  customActionButton: ReactNode | null
  setCustomActionButton: (button: ReactNode | null) => void
  
  // Notifications
  notificationCount: number
  setNotificationCount: (count: number) => void
  onNotificationClick: (() => void) | null
  setOnNotificationClick: (fn: (() => void) | null) => void
}

const NavbarContext = createContext<NavbarContextType | null>(null)

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [canOrganize, setCanOrganize] = useState(true)
  const [showOrganizeAll, setShowOrganizeAll] = useState(false)
  const [onOrganizeClick, setOnOrganizeClick] = useState<(() => void) | null>(null)
  const [customActionButton, setCustomActionButton] = useState<ReactNode | null>(null)
  const [notificationCount, setNotificationCount] = useState(0)
  const [onNotificationClick, setOnNotificationClick] = useState<(() => void) | null>(null)

  return (
    <NavbarContext.Provider
      value={{
        canOrganize,
        setCanOrganize,
        showOrganizeAll,
        setShowOrganizeAll,
        onOrganizeClick,
        setOnOrganizeClick: (fn) => setOnOrganizeClick(() => fn),
        customActionButton,
        setCustomActionButton,
        notificationCount,
        setNotificationCount,
        onNotificationClick,
        setOnNotificationClick: (fn) => setOnNotificationClick(() => fn),
      }}
    >
      {children}
    </NavbarContext.Provider>
  )
}

export function useNavbar() {
  const context = useContext(NavbarContext)
  if (!context) {
    throw new Error('useNavbar must be used within NavbarProvider')
  }
  return context
}
