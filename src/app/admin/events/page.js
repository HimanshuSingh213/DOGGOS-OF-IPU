import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteEventButton from '@/components/DeleteEventButton'

export default async function EventsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch all events
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--base-white)' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/admin" className="text-xl sm:text-2xl">📅</Link>
              <div>
                <h1 className="text-base sm:text-xl font-bold" style={{ color: 'var(--text-dark)' }}>
                  Manage Events
                </h1>
              </div>
            </div>
            <Link href="/admin">
              <button 
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium"
                style={{ 
                  backgroundColor: 'var(--primary-teal)',
                  color: 'white'
                }}
              >
                <span className="hidden sm:inline">← Back to Dashboard</span>
                <span className="sm:hidden">← Back</span>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>
            All Events ({events?.length || 0})
          </h2>
          <Link href="/admin/events/add" className="w-full sm:w-auto">
            <button 
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              style={{ 
                backgroundColor: 'var(--secondary-yellow)',
                color: 'var(--text-dark)'
              }}
            >
              <span>➕</span>
              Add New Event
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base">
            Error loading events: {error.message}
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {events && events.length > 0 ? (
            events.map((event) => {
              const eventDate = new Date(event.date)
              const isUpcoming = eventDate >= new Date()
              
              return (
                <div 
                  key={event.id}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 bg-gray-100">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl sm:text-6xl">
                        🎉
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div 
                      className="absolute top-2 right-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium shadow-sm"
                      style={{
                        backgroundColor: 
                          event.status === 'upcoming' ? 'var(--secondary-green)' :
                          event.status === 'ongoing' ? 'var(--secondary-yellow)' :
                          event.status === 'completed' ? 'var(--primary-teal)' :
                          'var(--accent-coral)',
                        color: event.status === 'ongoing' ? 'var(--text-dark)' : 'white'
                      }}
                    >
                      {event.status}
                    </div>

                    {/* Event Type Badge */}
                    <div 
                      className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium shadow-sm"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white'
                      }}
                    >
                      {event.event_type.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2" style={{ color: 'var(--text-dark)' }}>
                      {event.title}
                    </h3>
                    
                    <div className="space-y-1.5 mb-3 sm:mb-4 text-xs sm:text-sm" style={{ color: 'var(--text-gray)' }}>
                      <p className="flex items-center gap-2">
                        <span>📅</span>
                        <span className="font-medium">
                          {eventDate.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </p>
                      
                      {event.time && (
                        <p className="flex items-center gap-2">
                          <span>🕐</span>
                          <span>{event.time}</span>
                        </p>
                      )}
                      
                      {event.location && (
                        <p className="flex items-center gap-2 truncate">
                          <span>📍</span>
                          <span className="truncate">{event.location}</span>
                        </p>
                      )}

                      {event.max_participants && (
                        <p className="flex items-center gap-2">
                          <span>👥</span>
                          <span>Max: {event.max_participants} participants</span>
                        </p>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-xs sm:text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-gray)' }}>
                        {event.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link href={`/admin/events/edit/${event.id}`} className="flex-1">
                        <button 
                          className="w-full px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm hover:opacity-90 transition-opacity"
                          style={{ 
                            backgroundColor: 'var(--primary-teal)',
                            color: 'white'
                          }}
                        >
                          <span className="hidden sm:inline">✏️ Edit</span>
                          <span className="sm:hidden">✏️</span>
                        </button>
                      </Link>
                      <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-8 sm:py-12">
              <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📅</div>
              <p className="text-lg sm:text-xl mb-2 font-semibold" style={{ color: 'var(--text-dark)' }}>
                No events yet
              </p>
              <p className="text-sm sm:text-base mb-4" style={{ color: 'var(--text-gray)' }}>
                Create your first event to get started
              </p>
              <Link href="/admin/events/add">
                <button 
                  className="px-6 py-2.5 rounded-lg font-medium inline-flex items-center gap-2 text-sm sm:text-base"
                  style={{ 
                    backgroundColor: 'var(--secondary-yellow)',
                    color: 'var(--text-dark)'
                  }}
                >
                  <span>➕</span>
                  Add Your First Event
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}