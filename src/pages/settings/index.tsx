import { useSettingsTabs } from './hooks/useSettingsTabs'
import { useAutomationSettings } from './hooks/useAutomationSettings'
import { SettingsSidebar } from './components/SettingsSidebar'
import { ProfileSettings } from './components/ProfileSettings'
import { SecuritySettings } from './components/SecuritySettings'
import { AppearanceSettings } from './components/AppearanceSettings'
import { PrivacySettings } from './components/PrivacySettings'
import { AutomationSettings } from './components/AutomationSettings'
import { NotificationSettings } from './components/NotificationSettings'
import { LanguageSettings } from './components/LanguageSettings'
import { DeveloperSettings } from './components/DeveloperSettings'

export function SettingsPage() {
  const { activeTab, setActiveTab } = useSettingsTabs()
  const {
    autoOrganize,
    setAutoOrganize,
    autoScheduling,
    setAutoScheduling,
    autoRemoveDuplicates,
    setAutoRemoveDuplicates,
  } = useAutomationSettings()

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-theme-background">
      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content Area */}
          <div className="flex-1 p-8 bg-theme-background">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'privacy' && <PrivacySettings />}
            {activeTab === 'automation' && (
              <AutomationSettings
                autoOrganize={autoOrganize}
                onAutoOrganizeChange={setAutoOrganize}
                autoScheduling={autoScheduling}
                onAutoSchedulingChange={setAutoScheduling}
                autoRemoveDuplicates={autoRemoveDuplicates}
                onAutoRemoveDuplicatesChange={setAutoRemoveDuplicates}
              />
            )}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'language' && <LanguageSettings />}
            {activeTab === 'developer' && <DeveloperSettings />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
