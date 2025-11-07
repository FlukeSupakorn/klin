import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/layout/sidebar'
import { MyFilesPage } from './pages/my-files-page'
import { SecretFolderPage } from './pages/secret-folder-page'
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
            <Route path="/files/secret" element={<SecretFolderPage />} />
            <Route path="/tasks" element={<div className="p-6">Tasks Page</div>} />
            <Route path="/users" element={<div className="p-6">Users Page</div>} />
            <Route path="/subscription" element={<div className="p-6">Subscription Page</div>} />
            <Route path="/settings" element={<div className="p-6">Settings Page</div>} />
            <Route path="/help" element={<div className="p-6">Help & Support Page</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

