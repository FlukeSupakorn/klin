import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface AutomationSettingsProps {
  autoOrganize: boolean
  isFirstTime: boolean
  onAutoOrganizeChange: (checked: boolean) => void
  onFirstTimeChange: (checked: boolean) => void
}

export function AutomationSettings({
  autoOrganize,
  onAutoOrganizeChange,
}: AutomationSettingsProps) {
  return (
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
              <Switch checked={autoOrganize} onCheckedChange={onAutoOrganizeChange} />
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
          <Button>Save Automation Settings</Button>
        </div>
      </div>
    </div>
  )
}
