const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarGridProps {
  calendarDays: Array<{ day: number; isCurrentMonth: boolean; isToday: boolean }>
}

export function CalendarGrid({ calendarDays }: CalendarGridProps) {
  return (
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
            aspect-square border rounded-lg p-2 cursor-pointer transition-all
            ${item.isCurrentMonth ? 'bg-white border-slate-200 hover:border-indigo-600 hover:shadow-md' : 'bg-slate-50 border-slate-100'}
            ${item.isToday ? 'border-2 border-indigo-600 bg-indigo-50' : ''}
          `}
        >
          <div className={`text-sm ${item.isCurrentMonth ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
            {item.day}
          </div>
        </div>
      ))}
    </div>
  )
}
