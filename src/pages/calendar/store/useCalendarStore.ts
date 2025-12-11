import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CalendarEvent } from '../data/mockEvents'

interface CalendarState {
  events: CalendarEvent[]
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void
  updateEvent: (id: number, event: Partial<CalendarEvent>) => void
  deleteEvent: (id: number) => void
  getEventsForDate: (date: Date) => CalendarEvent[]
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      events: [],
      
      addEvent: (event) => {
        const newEvent: CalendarEvent = {
          ...event,
          id: Date.now(),
        }
        set((state) => ({
          events: [...state.events, newEvent],
        }))
      },
      
      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        }))
      },
      
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }))
      },
      
      getEventsForDate: (date) => {
        return get().events.filter((event) => {
          const eventDate = new Date(event.date)
          return (
            eventDate.getDate() === date.getDate() &&
            eventDate.getMonth() === date.getMonth() &&
            eventDate.getFullYear() === date.getFullYear()
          )
        })
      },
    }),
    {
      name: 'klin-calendar-storage',
    }
  )
)
