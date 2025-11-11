import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Code } from 'lucide-react'
import { useState } from 'react'

export function DeveloperSettings() {
  const [devMode, setDevMode] = useState(
    () => localStorage.getItem('klin-dev-mode') === 'true'
  )
  const [isFirstTime, setIsFirstTime] = useState(
    () => localStorage.getItem('klin-first-time-setup') !== 'completed'
  )

  const handleDevModeToggle = (checked: boolean) => {
    localStorage.setItem('klin-dev-mode', checked ? 'true' : 'false')
    setDevMode(checked)
  }

  const handleFirstTimeToggle = (checked: boolean) => {
    if (checked) {
      localStorage.removeItem('klin-first-time-setup')
      setIsFirstTime(true)
    } else {
      localStorage.setItem('klin-first-time-setup', 'completed')
      setIsFirstTime(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-theme-text mb-2">Developer Settings</h2>
      <p className="text-theme-secondary mb-6">Settings for testing and development purposes</p>
      
      <div className="space-y-6">
        {/* Dev Mode Toggle */}
        <div className="border border-theme-primary rounded-lg p-6 bg-theme-primary-light">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-theme-primary" />
                <h3 className="text-lg font-semibold text-theme-text">Developer Mode</h3>
              </div>
              <p className="text-sm text-theme-secondary mb-4">
                Enable developer mode to unlock special features for testing. When enabled, 
                the first-time setup will appear once per app session (on first Home visit), and
                all validation requirements will be removed.
              </p>
              <div className="bg-theme-background border border-theme rounded-md p-3">
                <p className="text-xs text-theme-text font-medium mb-1">Dev Mode Features:</p>
                <ul className="text-xs text-theme-secondary space-y-1 ml-4 list-disc">
                  <li><strong>Setup on app start</strong> - Shows setup dialog once when app opens (per session)</li>
                  <li><strong>Remove validation blockers</strong> - Can save with 0 folders (no minimum required)</li>
                  <li><strong>Quick testing</strong> - Easy iteration on onboarding flow</li>
                  <li><strong>Clear all folders</strong> - No restrictions on emptying folder lists</li>
                </ul>
              </div>
              <div className="mt-3 bg-theme-secondary border border-theme rounded-md p-3">
                <p className="text-xs text-theme-text font-medium mb-1">Current Status:</p>
                <p className="text-xs text-theme-secondary">
                  {devMode ? (
                    <span className="font-semibold">✅ Dev Mode is ACTIVE - Navigate to Home to test setup</span>
                  ) : (
                    <span>❌ Dev Mode is OFF - Normal validation applies</span>
                  )}
                </p>
              </div>
            </div>
            <div className="ml-4">
              <Switch
                checked={devMode}
                onCheckedChange={handleDevModeToggle}
              />
            </div>
          </div>
        </div>

        {/* Simulate First Time Setup Toggle */}
        <div className="border border-theme rounded-lg p-6 bg-theme-background">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-5 w-5 text-theme-primary" />
                <h3 className="text-lg font-semibold text-theme-text">Simulate First Time Setup</h3>
              </div>
              <p className="text-sm text-theme-secondary mb-4">
                Toggle this to immediately show the first-time setup wizard. When enabled, 
                navigating to Home page will display the welcome dialog.
              </p>
              <div className="bg-theme-secondary border border-theme rounded-md p-3">
                <p className="text-xs text-theme-text font-medium mb-1">Current Status:</p>
                <p className="text-xs text-theme-secondary">
                  {isFirstTime ? (
                    <span className="font-semibold">⚠️ First time mode is ACTIVE - Navigate to Home to see setup wizard</span>
                  ) : (
                    <span>✅ First time setup is completed - Toggle ON to test again</span>
                  )}
                </p>
              </div>
            </div>
            <div className="ml-4">
              <Switch
                checked={isFirstTime}
                onCheckedChange={handleFirstTimeToggle}
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">Developer Mode Notice</p>
              <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 ml-4 list-disc">
                <li>These settings are for testing purposes only</li>
                <li>Changes take effect immediately</li>
                <li>You may need to refresh the page to see some changes</li>
                <li>First time setup data is stored in localStorage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-theme pt-6">
          <h3 className="text-sm font-semibold text-theme-text mb-3">Quick Actions</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.clear()
                window.location.reload()
              }}
            >
              <svg className="h-4 w-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All Data
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <svg className="h-4 w-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
