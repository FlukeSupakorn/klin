import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SecuritySettings() {
  return (
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
  )
}
