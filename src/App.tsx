import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/layout/sidebar'
import { MyFilesPage } from './pages/my-files-page'
import { HistoryPage } from './pages/history-page'
import { NotePage } from './pages/note-page'
import { CalendarPage } from './pages/calendar-page'
import { SubscriptionPage } from './pages/subscription-page'
import { SettingsPage } from './pages/settings-page'
import { HelpSupportPage } from './pages/help-support-page'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-white overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/files" replace />} />
            <Route path="/files" element={<MyFilesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/note" element={<NotePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/help" element={<HelpSupportPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

