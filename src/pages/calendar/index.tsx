import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useCalendar } from './hooks/useCalendar'
import { CalendarHeader } from './components/CalendarHeader'
import { CalendarGrid } from './components/CalendarGrid'
import { CreateEventDialog } from './components/CreateEventDialog'
import { EventDetailsDialog } from './components/EventDetailsDialog'
import { useCalendarStore } from './store/useCalendarStore'
import { mockEvents } from './data/mockEvents'
import { useState, useEffect } from 'react'
import { CalendarEvent } from './data/mockEvents'
import { useNavbar } from '@/components/layout/NavbarContext'

export function CalendarPage() {
  const { setCustomActionButton } = useNavbar()
  const {
    year,
    month,
    calendarData,
    prevMonth,
    nextMonth,
    goToToday,
  } = useCalendar()

  const { events, addEvent, deleteEvent } = useCalendarStore()
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  // Set custom action button for navbar
  useEffect(() => {
    setCustomActionButton(
      <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        New Event
      </Button>
    )
    return () => setCustomActionButton(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Initialize with mock events on first load
  useEffect(() => {
    if (events.length === 0) {
      mockEvents.forEach(event => {
        addEvent(event)
      })
    }
  }, [])

  const handleCreateEvent = (eventData: any) => {
    addEvent(eventData)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEventDetailsOpen(true)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsCreateDialogOpen(true)
  }

  // Ensure dates are Date objects (in case they were serialized to strings)
  const allEvents = (events.length > 0 ? events : mockEvents).map(event => ({
    ...event,
    date: event.date instanceof Date ? event.date : new Date(event.date)
  }))

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-theme-background">
      {/* Content */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="bg-theme-background border border-theme rounded-xl overflow-hidden">
          <CalendarHeader
            month={month}
            year={year}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onToday={goToToday}
          />

          {/* View Mode Selector */}
          <div className="border-b border-theme px-6 py-3 flex items-center justify-between bg-theme-secondary/30">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-theme-primary text-white'
                    : 'bg-theme-background text-theme-secondary hover:bg-theme-tertiary'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-theme-primary text-white'
                    : 'bg-theme-background text-theme-secondary hover:bg-theme-tertiary'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'day'
                    ? 'bg-theme-primary text-white'
                    : 'bg-theme-background text-theme-secondary hover:bg-theme-tertiary'
                }`}
              >
                Day
              </button>
            </div>
            
            <div className="text-sm text-theme-secondary">
              {allEvents.length} events this month
            </div>
          </div>

          <CalendarGrid 
            calendarDays={calendarData} 
            events={allEvents} 
            currentMonth={month}
            currentYear={year}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
          />
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="mt-6 bg-theme-background border border-theme rounded-xl p-6">
          <h3 className="text-lg font-semibold text-theme-text mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {allEvents.length === 0 ? (
              <p className="text-sm text-theme-secondary text-center py-8">No events scheduled</p>
            ) : (
              allEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="flex items-start gap-3 p-4 bg-theme-secondary hover:bg-theme-tertiary rounded-lg border border-theme cursor-pointer transition-colors"
                >
                  <div className={`h-2 w-2 rounded-full ${event.color} mt-2`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-theme-text">{event.title}</h4>
                    <p className="text-sm text-theme-secondary mt-1">
                      {event.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-theme-muted">{event.time}</p>
                    {event.location && (
                      <p className="text-xs text-theme-muted mt-1">📍 {event.location}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateEventDialog
        isOpen={isCreateDialogOpen}
        onClose={() => {
          setIsCreateDialogOpen(false)
          setSelectedDate(undefined)
        }}
        onCreateEvent={handleCreateEvent}
        selectedDate={selectedDate}
      />

      <EventDetailsDialog
        event={selectedEvent}
        isOpen={isEventDetailsOpen}
        onClose={() => {
          setIsEventDetailsOpen(false)
          setSelectedEvent(null)
        }}
        onDelete={deleteEvent}
      />
    </div>
  )
}

export default CalendarPage
