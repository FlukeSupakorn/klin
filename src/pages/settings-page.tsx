import { useState } from 'react'
import { useTheme, Theme } from '@/context/theme-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Settings, Bell, User, Lock, Palette, Globe, BellRing, Sparkles, Code } from 'lucide-react'

const themes: { value: Theme; label: string; colors: string[] }[] = [
  { value: 'light', label: 'Light', colors: ['#4F46E5', '#F8FAFC', '#1E293B'] },
  { value: 'dark', label: 'Dark', colors: ['#6366F1', '#0F172A', '#F1F5F9'] },
  { value: 'blue', label: 'Ocean Blue', colors: ['#0EA5E9', '#E0F2FE', '#0C4A6E'] },
  { value: 'green', label: 'Forest Green', colors: ['#10B981', '#D1FAE5', '#065F46'] },
  { value: 'purple', label: 'Purple Dream', colors: ['#A855F7', '#F3E8FF', '#581C87'] },
]

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [autoOrganize, setAutoOrganize] = useState(false)
  const [autoRename, setAutoRename] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(
    () => localStorage.getItem('klin-first-time-setup') !== 'completed'
  )

  const handleFirstTimeToggle = (checked: boolean) => {
    if (checked) {
      // Remove the completed flag to simulate first time
      localStorage.removeItem('klin-first-time-setup')
      setIsFirstTime(true)
    } else {
      // Mark as completed
      localStorage.setItem('klin-first-time-setup', 'completed')
      setIsFirstTime(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'automation', label: 'Automation', icon: Sparkles },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'language', label: 'Language & Region', icon: Globe },
    { id: 'developer', label: 'Developer', icon: Code },
  ]

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Bell className="h-5 w-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex h-full">
          {/* Sidebar Tabs */}
          <div className="w-64 border-r border-slate-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Profile Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                        A
                      </div>
                      <Button variant="outline">Change Photo</Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <Input defaultValue="Azunyan U. Wu" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <Input type="email" defaultValue="azunyan@klin.app" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                    <Input type="password" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                    <Input type="password" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                    <Input type="password" />
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-3">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-600 mb-4">Add an extra layer of security to your account</p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>

                  <Button>Update Password</Button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">Theme</label>
                    <div className="grid grid-cols-2 gap-4">
                      {themes.map((themeOption) => (
                        <button
                          key={themeOption.value}
                          onClick={() => setTheme(themeOption.value)}
                          className={`p-4 border-2 rounded-xl transition-all ${
                            theme === themeOption.value
                              ? 'border-indigo-600 ring-2 ring-indigo-100'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex gap-1">
                              {themeOption.colors.map((color, i) => (
                                <div
                                  key={i}
                                  className="h-6 w-6 rounded-full border border-slate-200"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-slate-900">{themeOption.label}</div>
                            {theme === themeOption.value && (
                              <div className="text-sm text-indigo-600 mt-1">Currently active</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600" />
                      <span className="text-sm text-slate-700">Use system theme preference</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'automation' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Automation Settings</h2>
                <p className="text-slate-600 mb-6">Configure automatic file organization and renaming features</p>
                
                <div className="space-y-6">
                  {/* Auto Organize */}
                  <div className="border border-slate-200 rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-indigo-600" />
                          <h3 className="text-lg font-semibold text-slate-900">Auto Organize Files</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                          Automatically organize files into appropriate folders based on file type and content. 
                          Files will be moved to categorized folders like Documents, Images, Videos, etc.
                        </p>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-md p-3">
                          <p className="text-xs text-indigo-900 font-medium mb-1">How it works:</p>
                          <ul className="text-xs text-indigo-700 space-y-1 ml-4 list-disc">
                            <li>Images → Images/Photos folder</li>
                            <li>Documents → Documents/Work folder</li>
                            <li>Videos → Videos/Recordings folder</li>
                            <li>Code files → Projects/Code folder</li>
                          </ul>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Switch
                          checked={autoOrganize}
                          onCheckedChange={setAutoOrganize}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Auto Rename */}
                  <div className="border border-slate-200 rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="h-5 w-5 text-indigo-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <h3 className="text-lg font-semibold text-slate-900">Auto Rename Files</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                          Automatically rename files with descriptive names based on content analysis and metadata. 
                          Improves file searchability and organization.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                          <p className="text-xs text-amber-900 font-medium mb-1">Examples:</p>
                          <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc">
                            <li>IMG_1234.jpg → photo_2024_11_08_sunset.jpg</li>
                            <li>document.pdf → report_Q4_2024.pdf</li>
                            <li>video.mp4 → meeting_recording_nov_8.mp4</li>
                          </ul>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Switch
                          checked={autoRename}
                          onCheckedChange={setAutoRename}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Warning Notice */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-slate-900 mb-1">Important Notes</p>
                        <ul className="text-xs text-slate-600 space-y-1 ml-4 list-disc">
                          <li>Automation runs in the background when new files are detected in watched folders</li>
                          <li>You can always undo automatic changes from the History tab</li>
                          <li>Files are never deleted, only moved or renamed</li>
                          <li>System files and folders are automatically excluded</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <Button>
                      Save Automation Settings
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Notification Settings</h2>
                
                <div className="space-y-4">
                  {[
                    { label: 'Email notifications', description: 'Receive email updates about your files' },
                    { label: 'Push notifications', description: 'Get notified about important updates' },
                    { label: 'File sharing alerts', description: 'When someone shares a file with you' },
                    { label: 'Storage alerts', description: 'When you\'re running out of storage' },
                    { label: 'Security alerts', description: 'Unusual account activity and security updates' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                      <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-900">{item.label}</div>
                        <div className="text-sm text-slate-600">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'language' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Language & Region</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                      <option>English (US)</option>
                      <option>ไทย (Thai)</option>
                      <option>日本語 (Japanese)</option>
                      <option>中文 (Chinese)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Time Zone</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                      <option>Bangkok (GMT+7)</option>
                      <option>Tokyo (GMT+9)</option>
                      <option>New York (GMT-5)</option>
                      <option>London (GMT+0)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date Format</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {activeTab === 'developer' && (
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Developer Settings</h2>
                <p className="text-slate-600 mb-6">Settings for testing and development purposes</p>
                
                <div className="space-y-6">
                  {/* First Time Setup Toggle */}
                  <div className="border border-slate-200 rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="h-5 w-5 text-purple-600" />
                          <h3 className="text-lg font-semibold text-slate-900">Simulate First Time Setup</h3>
                        </div>
                        <p className="text-sm text-slate-600 mb-4">
                          Toggle this to test the first-time setup experience. When enabled, the app will show 
                          the welcome wizard on next page refresh, allowing you to test the onboarding flow.
                        </p>
                        <div className="bg-purple-50 border border-purple-200 rounded-md p-3">
                          <p className="text-xs text-purple-900 font-medium mb-1">Current Status:</p>
                          <p className="text-xs text-purple-700">
                            {isFirstTime ? (
                              <span className="font-semibold">First time mode is ACTIVE - Refresh the page to see the setup wizard</span>
                            ) : (
                              <span>First time setup is completed - Toggle ON to test again</span>
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
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-amber-900 mb-1">Developer Mode Notice</p>
                        <ul className="text-xs text-amber-700 space-y-1 ml-4 list-disc">
                          <li>These settings are for testing purposes only</li>
                          <li>Changes take effect immediately</li>
                          <li>You may need to refresh the page to see some changes</li>
                          <li>First time setup data is stored in localStorage</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">Quick Actions</h3>
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
