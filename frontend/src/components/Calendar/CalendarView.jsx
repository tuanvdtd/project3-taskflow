import { useState, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay, addDays, startOfDay, endOfDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useColorScheme } from '@mui/material/styles'
import { updateCurrentActiveCard, showActiveCardModal } from '~/redux/activeCard/activeCardSlice'
import { useDispatch, useSelector } from 'react-redux'

const locales = {
  'en-US': enUS
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})

function CalendarView() {
  const board = useSelector(selectCurrentActiveBoard)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const { mode } = useColorScheme()
  const darkMode = mode === 'dark'

  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())

  const events = useMemo(() => {
    if (!board || !board.columns) return []

    const allCards = board.columns.flatMap(column => column.cards || [])

    return allCards
      .filter(card => !card.isPlaceHolderCard && !card._destroy && card.dueDate)
      .filter(card => {
        if (!currentUser || !Array.isArray(card.memberIds)) return true
        return card.memberIds.includes(currentUser._id)
      })
      .map(card => {
        const start = new Date(card.createdAt)
        const end = new Date(card.dueDate)

        return {
          id: card._id,
          title: card.title,
          start: startOfDay(start),
          end: endOfDay(end),
          resource: card
        }
      })
  }, [board, currentUser])

  const users = board?.allUsers || []

  const getEventStyle = (event) => {
    const task = event.resource
    const now = new Date()
    const dueDate = task.dueDate ? new Date(task.dueDate) : null

    let backgroundColor = '#3b82f6'
    if (dueDate && dueDate < now) {
      backgroundColor = '#ef4444'
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '6px',
        border: 'none',
        color: 'white',
        fontSize: '0.875rem',
        padding: '2px 6px'
      }
    }
  }

  const handleSelectEvent = (event) => {
    const task = event.resource
    // Gán currentActiveCard vào redux
    dispatch(updateCurrentActiveCard(task))
    // Mở modal hiển thị chi tiết card
    dispatch(showActiveCardModal())
  }

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV')
    }

    const goToNext = () => {
      toolbar.onNavigate('NEXT')
    }

    const goToToday = () => {
      toolbar.onNavigate('TODAY')
    }

    return (
      <div className={`flex items-center justify-between mb-4 p-4 rounded-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-sm`}>
        <div className="flex items-center gap-2">
          <CalendarIcon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={darkMode ? 'text-white' : 'text-gray-900'}>
            {toolbar.label}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            } transition-colors`}
          >
            Today
          </button>

          <div className="flex gap-1">
            <button
              onClick={goToBack}
              className={`px-3 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } transition-colors`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              className={`px-3 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              } transition-colors`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-1 ml-2">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'month'
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'week'
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'day'
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!board) {
    return null
  }

  return (
    <div className={`h-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <style>{`
        .rbc-calendar {
          background: ${darkMode ? '#1f2937' : '#ffffff'};
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        }
        
        .rbc-header {
          padding: 12px 8px;
          font-weight: 600;
          color: ${darkMode ? '#f3f4f6' : '#111827'};
          border-bottom: 2px solid ${darkMode ? '#374151' : '#e5e7eb'};
        }
        
        .rbc-today {
          background-color: ${darkMode ? '#1e3a5f' : '#dbeafe'} !important;
        }
        
        .rbc-off-range-bg {
          background-color: ${darkMode ? '#111827' : '#f9fafb'};
        }
        
        .rbc-date-cell {
          padding: 8px;
          color: ${darkMode ? '#d1d5db' : '#374151'};
        }
        
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
          border: 1px solid ${darkMode ? '#374151' : '#e5e7eb'};
          border-radius: 8px;
          background: ${darkMode ? '#1f2937' : '#ffffff'};
        }
        
        .rbc-time-slot {
          border-top: 1px solid ${darkMode ? '#374151' : '#e5e7eb'};
        }
        
        .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid ${darkMode ? '#374151' : '#f3f4f6'};
        }
        
        .rbc-time-header-content {
          border-left: 1px solid ${darkMode ? '#374151' : '#e5e7eb'};
        }
        
        .rbc-time-content {
          border-top: 2px solid ${darkMode ? '#374151' : '#e5e7eb'};
        }
        
        .rbc-current-time-indicator {
          background-color: #ef4444;
          height: 2px;
        }
        
        .rbc-event {
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .rbc-event:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        
        .rbc-event-label {
          font-size: 0.75rem;
        }
        
        .rbc-toolbar {
          display: none;
        }
        
        .rbc-month-row {
          border-top: 1px solid ${darkMode ? '#374151' : '#e5e7eb'};
          min-height: 120px;
        }
        
        .rbc-day-bg + .rbc-day-bg {
          border-left: 1px solid ${darkMode ? '#374151' : '#e5e7eb'};
        }
        
        .rbc-time-column {
          color: ${darkMode ? '#9ca3af' : '#6b7280'};
        }
        
        .rbc-allday-cell {
          background: ${darkMode ? '#111827' : '#f9fafb'};
        }
      `}</style>

      <CustomToolbar
        label={format(date, view === 'month' ? 'MMMM yyyy' : 'MMMM dd, yyyy')}
        onNavigate={(action) => {
          if (action === 'PREV') {
            setDate(view === 'month' ? addDays(date, -30) : view === 'week' ? addDays(date, -7) : addDays(date, -1))
          } else if (action === 'NEXT') {
            setDate(view === 'month' ? addDays(date, 30) : view === 'week' ? addDays(date, 7) : addDays(date, 1))
          } else if (action === 'TODAY') {
            setDate(new Date())
          }
        }}
      />

      <div className="h-[calc(100vh-280px)]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={getEventStyle}
          popup
          tooltipAccessor={(event) => {
            const task = event.resource
            const assigneeNames = Array.isArray(task.memberIds)
              ? task.memberIds
                .map(id => users.find(u => u._id === id)?.displayName)
                .filter(Boolean)
                .join(', ')
              : ''
            return `${task.title}\n${assigneeNames ? `Assigned to: ${assigneeNames}` : ''}`
          }}
        />
      </div>
    </div>
  )
}

export default CalendarView