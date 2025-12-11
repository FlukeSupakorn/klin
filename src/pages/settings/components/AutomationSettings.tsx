import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Sparkles, HeartPulse } from 'lucide-react'

interface AutomationSettingsProps {
  autoOrganize: boolean
  onAutoOrganizeChange: (checked: boolean) => void
  autoScheduling: boolean
  onAutoSchedulingChange: (checked: boolean) => void
  autoRemoveDuplicates: boolean
  onAutoRemoveDuplicatesChange: (checked: boolean) => void
}

export function AutomationSettings({
  autoOrganize,
  onAutoOrganizeChange,
  autoScheduling,
  onAutoSchedulingChange,
  autoRemoveDuplicates,
  onAutoRemoveDuplicatesChange,
}: AutomationSettingsProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-theme-text mb-2">Automation Settings</h2>
      <p className="text-theme-secondary mb-6">Configure automatic file organization and renaming features</p>
      
      <div className="space-y-6">
        {/* Auto Scheduling */}
        <div className="border border-theme rounded-lg p-6 bg-theme-background">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5 text-theme-primary" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-theme-text">Auto Schedule Meetings</h3>
              </div>
              <p className="text-sm text-theme-secondary mb-4">
                Automatically detect meeting information in files and prompt you to add them to your calendar. 
                The AI will scan documents for meeting dates, times, and details.
              </p>
              <div className="bg-theme-primary-light border border-theme-primary rounded-md p-3">
                <p className="text-xs text-theme-primary font-medium mb-1">How it works:</p>
                <ul className="text-xs text-theme-primary space-y-1 ml-4 list-disc">
                  <li>Scans PDF and document files for meeting information</li>
                  <li>Detects dates, times, and meeting titles</li>
                  <li>Shows popup to confirm adding to calendar</li>
                  <li>Automatically creates calendar events with extracted details</li>
                </ul>
              </div>
            </div>
            <div className="ml-4">
              <Switch checked={autoScheduling} onCheckedChange={onAutoSchedulingChange} />
            </div>
          </div>
        </div>

        {/* Auto Organize */}
        <div className="border border-theme rounded-lg p-6 bg-theme-background">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-theme-primary" />
                <h3 className="text-lg font-semibold text-theme-text">Auto Organize Files</h3>
              </div>
              <p className="text-sm text-theme-secondary mb-4">
                Automatically organize files into appropriate folders based on file type and content. 
                Files will be moved to categorized folders like Documents, Images, Videos, etc.
              </p>
              <div className="bg-theme-primary-light border border-theme-primary rounded-md p-3">
                <p className="text-xs text-theme-primary font-medium mb-1">How it works:</p>
                <ul className="text-xs text-theme-primary space-y-1 ml-4 list-disc">
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

        {/* Auto Remove Duplicates */}
        <div className="border border-theme rounded-lg p-6 bg-theme-background">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <HeartPulse className="h-5 w-5 text-theme-primary" />
                <h3 className="text-lg font-semibold text-theme-text">Auto Remove Duplicates</h3>
              </div>
              <p className="text-sm text-theme-secondary mb-4">
                Automatically delete duplicate files after scanning in File Health, keeping one copy per group. 
                All removals are logged to Activity for your review.
              </p>
              <div className="bg-theme-primary-light border border-theme-primary rounded-md p-3">
                <p className="text-xs text-theme-primary font-medium mb-1">Safety notes:</p>
                <ul className="text-xs text-theme-primary space-y-1 ml-4 list-disc">
                  <li>Keeps one original copy in each duplicate group</li>
                  <li>Logs all removals to Activity with "duplicated" tag</li>
                  <li>System and excluded folders are not affected</li>
                </ul>
              </div>
            </div>
            <div className="ml-4">
              <Switch checked={autoRemoveDuplicates} onCheckedChange={onAutoRemoveDuplicatesChange} />
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="bg-theme-secondary border border-theme rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-theme-secondary mt-0.5 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-theme-text mb-1">Important Notes</p>
              <ul className="text-xs text-theme-secondary space-y-1 ml-4 list-disc">
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
