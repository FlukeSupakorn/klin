import { Button } from '@/components/ui/button'
import { Settings, Bell, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCalendar } from './hooks/useCalendar'
import { CalendarHeader } from './components/CalendarHeader'
import { CalendarGrid } from './components/CalendarGrid'
import { useState } from 'react'

export function CalendarPage() {
  const navigate = useNavigate()
  const {
    year,
    month,
    calendarData,
    prevMonth,
    nextMonth,
    goToToday,
  } = useCalendar()

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')

  // Mock events for demonstration
  const mockEvents = [
    {
      id: 1,
      title: 'Senior Project Presentation Review',
      date: new Date(2025, 11, 15), // December 15, 2025
      time: '2:00 PM - 3:30 PM',
      color: 'bg-blue-500',
      location: 'Conference Room A',
    },
    {
      id: 2,
      title: 'Team Meeting',
      date: new Date(2025, 11, 10),
      time: '10:00 AM - 11:00 AM',
      color: 'bg-green-500',
      location: 'Online',
    },
    {
      id: 3,
      title: 'Project Deadline',
      date: new Date(2025, 11, 20),
      time: '11:59 PM',
      color: 'bg-red-500',
      location: 'Submit Online',
    },
  ]

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-theme-background">
      {/* Header */}
      <div className="bg-theme-background border-b border-theme px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-theme-text">Calendar</h1>
            <p className="text-sm text-theme-secondary mt-1">Manage your schedule and events</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="h-10 w-10 rounded-lg border border-theme flex items-center justify-center hover-bg-theme-secondary"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5 text-theme-secondary" />
            </button>
            <button className="h-10 w-10 rounded-lg border border-theme flex items-center justify-center hover-bg-theme-secondary">
              <Bell className="h-5 w-5 text-theme-secondary" />
            </button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Event
            </Button>
          </div>
        </div>
      </div>

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
              {mockEvents.length} events this month
            </div>
          </div>

          <CalendarGrid calendarDays={calendarData} events={mockEvents} />
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="mt-6 bg-theme-background border border-theme rounded-xl p-6">
          <h3 className="text-lg font-semibold text-theme-text mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {mockEvents.map((event) => (
              <div
                key={event.id}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
