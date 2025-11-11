import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function ProfileSettings() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-theme-text mb-6">Profile Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-theme-primary flex items-center justify-center text-white text-2xl font-bold">
              A
            </div>
            <Button variant="outline">Change Photo</Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">Full Name</label>
          <Input defaultValue="Azunyan U. Wu" />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">Email</label>
          <Input type="email" defaultValue="azunyan@klin.app" />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">Bio</label>
          <textarea
            className="w-full px-3 py-2 border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary bg-theme-background text-theme-text"
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>

        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
