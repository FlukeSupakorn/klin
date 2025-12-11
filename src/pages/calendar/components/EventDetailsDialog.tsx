import { Calendar, Clock, MapPin, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CalendarEvent } from '../data/mockEvents'

interface EventDetailsDialogProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  onDelete?: (id: number) => void
}

export function EventDetailsDialog({ event, isOpen, onClose, onDelete }: EventDetailsDialogProps) {
  if (!event) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          {event.description && (
            <DialogDescription>{event.description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4 space-y-3">
          {/* Date */}
          <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
            <Calendar className="h-5 w-5 text-theme-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-theme-muted mb-1">Date</p>
              <p className="text-sm font-semibold text-theme-text">
                {event.date.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
            <Clock className="h-5 w-5 text-theme-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-theme-muted mb-1">Time</p>
              <p className="text-sm font-semibold text-theme-text">{event.time}</p>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
              <MapPin className="h-5 w-5 text-theme-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-theme-muted mb-1">Location</p>
                <p className="text-sm font-semibold text-theme-text">{event.location}</p>
              </div>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex items-start gap-3 p-3 bg-theme-secondary/50 rounded-lg">
              <Users className="h-5 w-5 text-theme-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-theme-muted mb-1">Attendees</p>
                <div className="flex flex-wrap gap-2">
                  {event.attendees.map((attendee, index) => (
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
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {onDelete && (
            <Button 
              variant="outline" 
              onClick={() => {
                onDelete(event.id)
                onClose()
              }}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
              Delete Event
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
