import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EventForm from '@/components/EventForm'
import Link from 'next/link'

export default async function AddEventPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--base-white)' }}>
      <nav className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/admin" className="text-xl sm:text-2xl">📅</Link>
              <h1 className="text-base sm:text-xl font-bold" style={{ color: 'var(--text-dark)' }}>
                Add New Event
              </h1>
            </div>
            <Link href="/admin/events">
              <button 
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium"
                style={{ 
                  backgroundColor: 'var(--primary-teal)',
                  color: 'white'
                }}
              >
                ← Back
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        <EventForm />
      </main>
    </div>
  )
}