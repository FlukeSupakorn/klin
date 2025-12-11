import { Calendar, Clock, MapPin, FileText, X, CheckCircle, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { mockMeetingData } from '../data/mockEvents'
import { useNavigate } from 'react-router-dom'
import { useAutomationSettings } from '@/pages/settings/hooks/useAutomationSettings'
import { useToast } from '@/components/ui/toast'

interface MeetingSchedulingPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function MeetingSchedulingPopup({ isOpen, onClose }: MeetingSchedulingPopupProps) {
  const navigate = useNavigate()
  const { autoScheduling, setAutoScheduling } = useAutomationSettings()
  const toast = useToast()

  const handleConfirm = () => {
    navigate('/calendar')
    onClose()
  }

  const handleReject = () => {
    onClose()
    // Show toast after dialog closes
    setTimeout(() => {
      toast.info('Meeting Removed', 'The meeting has been removed from your calendar')
    }, 100)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-theme-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-theme-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Meeting Found</DialogTitle>
                <DialogDescription>
                  I detected a meeting in your document and automatically added it to your calendar. You can confirm or reject this action.
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Source File Info */}
          <div className="bg-theme-primary-light border border-theme-primary rounded-lg p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-theme-primary" />
              <span className="text-sm font-medium text-theme-primary">
                Found in: {mockMeetingData.fileName}
              </span>
            </div>
          </div>

          {/* Meeting Details Card */}
          <div className="border border-theme rounded-xl p-5 bg-theme-background space-y-4">
            {/* Title */}
            <div>
              <h3 className="text-lg font-bold text-theme-text mb-1">
                {mockMeetingData.title}
              </h3>
              <p className="text-sm text-theme-secondary">
                {mockMeetingData.description}
              </p>
            </div>

            {/* Meeting Info Grid */}
            <div className="grid grid-cols-1 gap-3">
              {/* Date */}
              <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
                <Calendar className="h-5 w-5 text-theme-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-theme-muted mb-1">Date</p>
                  <p className="text-sm font-semibold text-theme-text">{mockMeetingData.date}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
                <Clock className="h-5 w-5 text-theme-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-theme-muted mb-1">Time</p>
                  <p className="text-sm font-semibold text-theme-text">{mockMeetingData.time}</p>
                  <p className="text-xs text-theme-muted mt-1">Duration: {mockMeetingData.duration}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
                <MapPin className="h-5 w-5 text-theme-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-theme-muted mb-1">Location</p>
                  <p className="text-sm font-semibold text-theme-text">{mockMeetingData.location}</p>
                </div>
              </div>

              {/* Attendees */}
              <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
                <svg 
                  className="h-5 w-5 text-theme-primary mt-0.5" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-xs font-medium text-theme-muted mb-1">Attendees</p>
                  <div className="flex flex-wrap gap-2">
                    {mockMeetingData.attendees.map((attendee, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-theme-tertiary px-2 py-1 rounded-full text-theme-text"
                      >
                        {attendee}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Confidence Notice */}
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300">
                <span className="font-semibold">High Confidence:</span> Meeting details extracted with 95% accuracy
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3">
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={handleReject} className="flex-1 gap-2">
              <X className="h-4 w-4" />
              Reject
            </Button>
            <Button onClick={handleConfirm} className="flex-1 gap-2">
              <Calendar className="h-4 w-4" />
              View in Calendar
            </Button>
          </div>

          {/* Auto Scheduling Toggle */}
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-theme-secondary">
              <Settings className="h-4 w-4" />
              <span>Auto-schedule meetings</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setAutoScheduling(!autoScheduling)
              }}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoScheduling ? 'bg-theme-primary' : 'bg-theme-tertiary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoScheduling ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
