import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Settings, Bell, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  
  const calendarDays = []
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false, isToday: false })
  }
  
  // Current month days
  const today = new Date()
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear()
    calendarDays.push({ day: i, isCurrentMonth: true, isToday })
  }
  
  // Next month days
  const remainingDays = 42 - calendarDays.length
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({ day: i, isCurrentMonth: false, isToday: false })
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1))
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Calendar</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your schedule and events</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Settings className="h-5 w-5 text-slate-600" />
            </button>
            <button className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
              <Bell className="h-5 w-5 text-slate-600" />
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
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{MONTHS[month]} {year}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day headers */}
            {DAYS.map(day => (
              <div key={day} className="text-center py-3 text-sm font-semibold text-slate-700">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((item, index) => (
              <div
                key={index}
                className={`
                  aspect-square border border-slate-200 rounded-lg p-2 hover:bg-slate-50 cursor-pointer transition-colors
                  ${!item.isCurrentMonth ? 'bg-slate-50 text-slate-400' : 'bg-white'}
                  ${item.isToday ? 'ring-2 ring-indigo-600 bg-indigo-50' : ''}
                `}
              >
                <div className={`text-sm font-medium ${item.isToday ? 'text-indigo-600' : ''}`}>
                  {item.day}
                </div>
              </div>
            ))}
          </div>

          {/* Events List */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">15</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">Team Meeting</h4>
                  <p className="text-sm text-slate-500">10:00 AM - 11:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-semibold text-sm">18</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">Project Review</h4>
                  <p className="text-sm text-slate-500">2:00 PM - 3:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
