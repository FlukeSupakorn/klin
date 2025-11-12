import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SecuritySettings() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-theme-text mb-6">Security Settings</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">Current Password</label>
          <Input type="password" />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">New Password</label>
          <Input type="password" />
        </div>

        <div>
          <label className="block text-sm font-medium text-theme-text mb-2">Confirm New Password</label>
          <Input type="password" />
        </div>

        <div className="pt-4 border-t border-theme">
          <h3 className="font-semibold text-theme-text mb-3">Two-Factor Authentication</h3>
          <p className="text-sm text-theme-secondary mb-4">Add an extra layer of security to your account</p>
          <Button variant="outline">Enable 2FA</Button>
        </div>

        <Button>Update Password</Button>
      </div>
    </div>
  )
}
