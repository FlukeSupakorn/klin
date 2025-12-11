import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/layout/sidebar'
import { TopNavbar } from './components/layout/TopNavbar'
import { NavbarProvider } from './components/layout/NavbarContext'
import { ToastContainer } from './components/ui/toast'
import DashboardPage from './pages/dashboard'
import ActivityPage from './pages/activity'
import NotePage from './pages/note'
import InsightsPage from './pages/insights'
import CalendarPage from './pages/calendar'
import FileHealthPage from './pages/file-health'
import SettingsPage from './pages/settings'
import HelpSupportPage from './pages/help-support'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <NavbarProvider>
        <div className="flex h-screen bg-theme-background overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopNavbar />
            <main className="flex-1 flex flex-col overflow-hidden bg-theme-background">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/insights" element={<InsightsPage />} />
                <Route path="/history" element={<ActivityPage />} />
                <Route path="/note" element={<NotePage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/file-health" element={<FileHealthPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<HelpSupportPage />} />
              </Routes>
            </main>
          </div>
          <ToastContainer />
        </div>
      </NavbarProvider>
    </BrowserRouter>
  )
}

export default App

