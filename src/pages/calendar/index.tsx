import { Button } from '@/components/ui/button'
import { Settings, Bell, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCalendar } from './hooks/useCalendar'
import { CalendarHeader } from './components/CalendarHeader'
import { CalendarGrid } from './components/CalendarGrid'

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
            <button 
              className="h-10 w-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              onClick={() => navigate('/settings')}
            >
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
          <CalendarHeader
            month={month}
            year={year}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            onToday={goToToday}
          />

          <CalendarGrid calendarDays={calendarData} />
        </div>
      </div>
    </div>
  )
}

export default CalendarPage
