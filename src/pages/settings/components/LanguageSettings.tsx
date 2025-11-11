import { Button } from '@/components/ui/button'

export function LanguageSettings() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-theme-text mb-6">Language & Region</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">Language</label>
          <select className="w-full px-3 py-2 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary bg-theme-background text-theme-text">
            <option>English (US)</option>
            <option>ไทย (Thai)</option>
            <option>日本語 (Japanese)</option>
            <option>中文 (Chinese)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">Time Zone</label>
          <select className="w-full px-3 py-2 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary bg-theme-background text-theme-text">
            <option>Bangkok (GMT+7)</option>
            <option>Tokyo (GMT+9)</option>
            <option>New York (GMT-5)</option>
            <option>London (GMT+0)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">Date Format</label>
          <select className="w-full px-3 py-2 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary bg-theme-background text-theme-text">
            <option>MM/DD/YYYY</option>
            <option>DD/MM/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>

        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
