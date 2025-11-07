import { useState } from 'react'
import { useTheme, Theme } from '@/context/theme-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Bell, User, Lock, Palette, Globe, BellRing } from 'lucide-react'

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

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'language', label: 'Language & Region', icon: Globe },
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
          </div>
        </div>
      </div>
    </div>
  )
}
