import { useState } from 'react'
import { Calendar, Clock, MapPin, FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'

interface CreateEventDialogProps {
  isOpen: boolean
  onClose: () => void
  onCreateEvent: (event: {
    title: string
    date: Date
    time: string
    location: string
    description: string
    color: string
  }) => void
  selectedDate?: Date
}

export function CreateEventDialog({ 
  isOpen, 
  onClose, 
  onCreateEvent, 
  selectedDate 
}: CreateEventDialogProps) {
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(
    selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0]
  )
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('bg-blue-500')

  const colors = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-pink-500', label: 'Pink' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !date || !time) {
      toast.error('Required Fields', 'Please fill in title, date, and time')
      return
    }

    onCreateEvent({
      title: title.trim(),
      date: new Date(date),
      time,
      location: location.trim(),
      description: description.trim(),
      color,
    })

    // Reset form
    setTitle('')
    setDate(new Date().toISOString().split('T')[0])
    setTime('')
    setLocation('')
    setDescription('')
    setColor('bg-blue-500')
    
    toast.success('Event Created', 'Your event has been added to the calendar')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Event</DialogTitle>
          <DialogDescription>
            Add a new event to your calendar
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-theme-text mb-2 block">
              Event Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team Meeting"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-theme-text mb-2 block flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date *
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-theme-text mb-2 block flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time *
              </label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium text-theme-text mb-2 block flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Conference Room A"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-theme-text mb-2 block flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add event details..."
              className="w-full min-h-[100px] px-3 py-2 border border-theme rounded-lg bg-theme-background text-theme-text resize-none focus:outline-none focus:ring-2 focus:ring-theme-primary"
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-sm font-medium text-theme-text mb-2 block">
              Color
            </label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-8 w-8 rounded-lg ${c.value} transition-all ${
                    color === c.value ? 'ring-2 ring-theme-primary ring-offset-2' : ''
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
