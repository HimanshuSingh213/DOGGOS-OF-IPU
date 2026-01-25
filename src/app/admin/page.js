import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch real stats from database
  const { data: allDogs } = await supabase
    .from('adoptions')
    .select('*')

  const stats = {
    totalDogs: allDogs?.length || 0,
    available: allDogs?.filter(d => d.status === 'available').length || 0,
    adopted: allDogs?.filter(d => d.status === 'adopted').length || 0,
    vaccinated: allDogs?.filter(d => d.vaccinated === true).length || 0,
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--base-white)' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🐶</span>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>
                  Doggos of IPU
                </h1>
                <p className="text-xs" style={{ color: 'var(--text-gray)' }}>
                  Admin Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs" style={{ color: 'var(--text-gray)' }}>Logged in as</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>
                  {user.email}
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold" style={{ color: 'var(--text-dark)' }}>
            Welcome Back! 👋
          </h2>
          <p className="mt-2" style={{ color: 'var(--text-gray)' }}>
            Manage adoptions for Doggos of IPU
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="p-6 rounded-xl shadow-sm border"
            style={{ backgroundColor: 'var(--primary-sky)', borderColor: 'var(--primary-teal)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>
                  Total Dogs
                </p>
                <p className="text-4xl font-bold mt-2" style={{ color: 'var(--primary-teal)' }}>
                  {stats.totalDogs}
                </p>
              </div>
              <div className="text-5xl">🐕</div>
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--text-gray)' }}>
              In database
            </p>
          </div>

          <div 
            className="p-6 rounded-xl shadow-sm border"
            style={{ backgroundColor: 'var(--earthy-cream)', borderColor: 'var(--secondary-green)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>
                  Available
                </p>
                <p className="text-4xl font-bold mt-2" style={{ color: 'var(--secondary-green)' }}>
                  {stats.available}
                </p>
              </div>
              <div className="text-5xl">🏠</div>
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--text-gray)' }}>
              Ready for adoption
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8" style={{ borderColor: 'var(--border-light)' }}>
          <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-dark)' }}>
            🐾 Adoption Management
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/adoptions/add">
              <button 
                className="w-full p-5 border-2 rounded-xl transition-all text-left hover:shadow-md"
                style={{ 
                  borderColor: 'var(--secondary-green)',
                  backgroundColor: 'var(--earthy-cream)'
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">➕</span>
                  <p className="font-semibold text-lg" style={{ color: 'var(--text-dark)' }}>
                    Add New Dog
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-gray)' }}>
                  Add a new dog for adoption with photos
                </p>
              </button>
            </Link>

            <Link href="/admin/adoptions">
              <button 
                className="w-full p-5 border-2 rounded-xl transition-all text-left hover:shadow-md"
                style={{ 
                  borderColor: 'var(--primary-teal)',
                  backgroundColor: 'var(--primary-sky)'
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📋</span>
                  <p className="font-semibold text-lg" style={{ color: 'var(--text-dark)' }}>
                    Manage All Dogs
                  </p>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-gray)' }}>
                  View, edit, or delete dog listings
                </p>
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}