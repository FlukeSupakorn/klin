import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/layout/sidebar'
import { ToastContainer } from './components/ui/toast'
import HomePage from './pages/home'
import HistoryPage from './pages/history'
import NotePage from './pages/note'
import CalendarPage from './pages/calendar'
import { SubscriptionPage } from './pages/subscription-page'
import SettingsPage from './pages/settings'
import HelpSupportPage from './pages/help-support'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-white overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/files" replace />} />
            <Route path="/files" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/note" element={<NotePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpSupportPage />} />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </BrowserRouter>
  )
}

export default App

