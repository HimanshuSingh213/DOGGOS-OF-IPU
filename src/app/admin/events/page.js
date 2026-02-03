import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteEventButton from '@/components/DeleteEventButton'

import {
  FaCalendarAlt,
  FaArrowLeft,
  FaPlus,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaEdit,
  FaImage,
} from 'react-icons/fa'

export default async function EventsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  return (
    <div className="min-h-screen bg-(--base-white)">
      {/* NAVBAR */}
      <nav className="bg-(--base-white) border-b shadow-sm"
        style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-2xl text-(--primary-teal)" />
            <h1 className="text-lg sm:text-xl font-bold text-(--text-dark)">
              Manage Events
            </h1>
          </div>

          <Link href="/admin">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium text-white bg-(--primary-teal)">
              <FaArrowLeft />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-(--text-dark)">
            📅 All Events ({events?.length || 0})
          </h2>

          <Link href="/admin/events/add">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-(--secondary-yellow) text-(--text-dark)">
              <FaPlus />
              Add New Event
            </button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            ❌ Error loading events: {error.message}
          </div>
        )}

        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events && events.length > 0 ? (
            events.map((event) => {
              const eventDate = new Date(event.date)

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition"
                  style={{ borderColor: 'var(--border-light)' }}
                >
                  {/* IMAGE */}
                  <div className="relative h-44 sm:h-52 bg-(--earthy-cream) rounded-t-2xl overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-(--text-gray)">
                        <FaImage className="text-5xl mb-2" />
                        <span className="text-sm">No image</span>
                      </div>
                    )}

                    {/* STATUS */}
                    <span
                      className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold shadow"
                      style={{
                        backgroundColor:
                          event.status === 'upcoming'
                            ? 'var(--secondary-green)'
                            : event.status === 'ongoing'
                            ? 'var(--secondary-yellow)'
                            : 'var(--primary-teal)',
                        color:
                          event.status === 'ongoing'
                            ? 'var(--text-dark)'
                            : 'white',
                      }}
                    >
                      {event.status}
                    </span>

                    {/* TYPE */}
                    <span className="absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white">
                      🐾 {event.event_type.replace('_', ' ')}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2 text-(--text-dark)">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-sm text-(--text-gray) mb-3">
                      <p className="flex items-center gap-2">
                        <FaCalendarAlt />
                        {eventDate.toDateString()}
                      </p>

                      {event.time && (
                        <p className="flex items-center gap-2">
                          <FaClock />
                          {event.time}
                        </p>
                      )}

                      {event.location && (
                        <p className="flex items-center gap-2 truncate">
                          <FaMapMarkerAlt />
                          <span className="truncate">{event.location}</span>
                        </p>
                      )}

                      {event.max_participants && (
                        <p className="flex items-center gap-2">
                          <FaUsers />
                          Max {event.max_participants} participants
                        </p>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-sm text-(--text-gray) line-clamp-2 mb-4">
                        {event.description}
                      </p>
                    )}

                    {/* ACTIONS */}
                    <div className="flex gap-2">
                      <Link href={`/admin/events/edit/${event.id}`} className="flex-1">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-(--primary-teal) text-white text-sm">
                          <FaEdit />
                          Edit
                        </button>
                      </Link>

                      <DeleteEventButton
                        eventId={event.id}
                        eventTitle={event.title}
                      />
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center py-14">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-(--text-dark)">
                No events yet
              </h3>
              <p className="text-(--text-gray) mb-4">
                Create your first event to get started 🐾
              </p>
              <Link href="/admin/events/add">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-(--secondary-yellow) text-(--text-dark) font-medium">
                  <FaPlus />
                  Add Event
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
