import { useSettingsTabs } from './hooks/useSettingsTabs'
import { useAutomationSettings } from './hooks/useAutomationSettings'
import { SettingsSidebar } from './components/SettingsSidebar'
import { ProfileSettings } from './components/ProfileSettings'
import { SecuritySettings } from './components/SecuritySettings'
import { AppearanceSettings } from './components/AppearanceSettings'
import { AutomationSettings } from './components/AutomationSettings'
import { NotificationSettings } from './components/NotificationSettings'
import { LanguageSettings } from './components/LanguageSettings'
import { DeveloperSettings } from './components/DeveloperSettings'

export function SettingsPage() {
  const { activeTab, setActiveTab } = useSettingsTabs()
  const {
    autoOrganize,
    setAutoOrganize,
    autoRename,
    setAutoRename,
    isFirstTime,
    handleFirstTimeToggle,
  } = useAutomationSettings()

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content Area */}
          <div className="flex-1 p-8">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'automation' && (
              <AutomationSettings
                autoOrganize={autoOrganize}
                autoRename={autoRename}
                isFirstTime={isFirstTime}
                onAutoOrganizeChange={setAutoOrganize}
                onAutoRenameChange={setAutoRename}
                onFirstTimeChange={handleFirstTimeToggle}
              />
            )}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'language' && <LanguageSettings />}
            {activeTab === 'developer' && (
              <DeveloperSettings
                isFirstTime={isFirstTime}
                onFirstTimeChange={handleFirstTimeToggle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
