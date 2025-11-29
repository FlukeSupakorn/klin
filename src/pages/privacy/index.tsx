import { PrivacySettingsPanel } from './PrivacySettingsPanel'

export default function PrivacyPage() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-theme-background">
      <div className="bg-theme-background border-b border-theme px-8 py-6">
        <h1 className="text-3xl font-bold text-theme-text">Privacy & Data</h1>
        <p className="text-sm text-theme-secondary mt-1">Manage excludes and pattern rules for sensitive files.</p>
      </div>
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <PrivacySettingsPanel />
        </div>
      </div>
    </div>
  )
}
