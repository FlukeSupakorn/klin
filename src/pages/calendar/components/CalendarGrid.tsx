const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface Event {
  id: number
  title: string
  date: Date
  time: string
  color: string
  location?: string
}

interface CalendarGridProps {
  calendarDays: Array<{ day: number; isCurrentMonth: boolean; isToday: boolean }>
  events?: Event[]
}

export function CalendarGrid({ calendarDays, events = [] }: CalendarGridProps) {
  // Helper function to check if a day has events
  const getEventsForDay = (day: number, month: number, year: number) => {
    return events.filter(event => {
      return (
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year
      )
    })
  }

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  return (
    <div className="p-6">
      <div className="grid grid-cols-7 gap-px bg-theme">
        {/* Day headers */}
        {DAYS.map(day => (
          <div key={day} className="bg-theme-secondary text-center py-3 text-sm font-semibold text-theme-text">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((item, index) => {
          const dayEvents = getEventsForDay(item.day, currentMonth, currentYear)
          return (
            <div
              key={index}
              className={`
                min-h-[100px] bg-theme-background p-2 cursor-pointer transition-all hover:bg-theme-secondary/50
                ${item.isCurrentMonth ? 'bg-theme-background' : 'bg-theme-secondary/30'}
                ${item.isToday ? 'ring-2 ring-theme-primary ring-inset' : ''}
              `}
            >
              <div className={`
                text-sm font-medium mb-1
                ${item.isCurrentMonth ? 'text-theme-text' : 'text-theme-muted'}
                ${item.isToday ? 'flex items-center justify-center w-6 h-6 rounded-full bg-theme-primary text-white' : ''}
              `}>
                {item.day}
              </div>
              
              {/* Events for this day */}
              <div className="space-y-1 mt-2">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs px-2 py-1 rounded ${event.color} text-white truncate`}
                    title={`${event.title} - ${event.time}`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-theme-muted px-2">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
