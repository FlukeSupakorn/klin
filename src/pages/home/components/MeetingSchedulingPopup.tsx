import { Calendar, Clock, MapPin, FileText, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface MeetingSchedulingPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function MeetingSchedulingPopup({ isOpen, onClose, onConfirm }: MeetingSchedulingPopupProps) {
  // Mock meeting data
  const mockMeeting = {
    title: 'Senior Project Presentation Review',
    fileName: 'ProposalPresentation.pdf',
    date: 'December 15, 2025',
    time: '2:00 PM - 3:30 PM',
    location: 'Conference Room A, Building 3',
    duration: '1 hour 30 minutes',
    attendees: ['Dr. Smith', 'Prof. Johnson', 'Team Members'],
    description: 'Final review and feedback session for the senior project proposal presentation. Please bring printed copies of the presentation slides and be prepared to discuss methodology and timeline.',
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
                <DialogTitle className="text-xl">Meeting Detected</DialogTitle>
                <DialogDescription>
                  Would you like to add this meeting to your calendar?
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
                Found in: {mockMeeting.fileName}
              </span>
            </div>
          </div>

          {/* Meeting Details Card */}
          <div className="border border-theme rounded-xl p-5 bg-theme-background space-y-4">
            {/* Title */}
            <div>
              <h3 className="text-lg font-bold text-theme-text mb-1">
                {mockMeeting.title}
              </h3>
              <p className="text-sm text-theme-secondary">
                {mockMeeting.description}
              </p>
            </div>

            {/* Meeting Info Grid */}
            <div className="grid grid-cols-1 gap-3">
              {/* Date */}
              <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
                <Calendar className="h-5 w-5 text-theme-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-theme-muted mb-1">Date</p>
                  <p className="text-sm font-semibold text-theme-text">{mockMeeting.date}</p>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
                <Clock className="h-5 w-5 text-theme-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-theme-muted mb-1">Time</p>
                  <p className="text-sm font-semibold text-theme-text">{mockMeeting.time}</p>
                  <p className="text-xs text-theme-muted mt-1">Duration: {mockMeeting.duration}</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
                <MapPin className="h-5 w-5 text-theme-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-theme-muted mb-1">Location</p>
                  <p className="text-sm font-semibold text-theme-text">{mockMeeting.location}</p>
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
                    {mockMeeting.attendees.map((attendee, index) => (
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

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="gap-2">
            <X className="h-4 w-4" />
            Not Now
          </Button>
          <Button onClick={onConfirm} className="gap-2">
            <Calendar className="h-4 w-4" />
            Add to Calendar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
