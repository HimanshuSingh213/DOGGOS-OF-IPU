import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DeleteButton from '@/components/DeleteButton'

export default async function AdoptionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  // Fetch all dogs
  const { data: dogs, error } = await supabase
    .from('adoptions')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--base-white)' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b" style={{ borderColor: 'var(--border-light)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-2xl">🐶</Link>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>
                  Manage Dogs
                </h1>
              </div>
            </div>
            <Link href="/admin">
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ 
                  backgroundColor: 'var(--primary-teal)',
                  color: 'white'
                }}
              >
                ← Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-dark)' }}>
            All Dogs ({dogs?.length || 0})
          </h2>
          <Link href="/admin/adoptions/add">
            <button 
              className="px-6 py-3 rounded-lg font-medium flex items-center gap-2"
              style={{ 
                backgroundColor: 'var(--secondary-green)',
                color: 'white'
              }}
            >
              <span>➕</span>
              Add New Dog
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            Error loading dogs: {error.message}
          </div>
        )}

        {/* Dogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dogs && dogs.length > 0 ? (
            dogs.map((dog) => (
              <div 
                key={dog.id}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
                style={{ borderColor: 'var(--border-light)' }}
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100">
                  {dog.photos && dog.photos.length > 0 ? (
                    <img
                      src={dog.photos[0]}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🐕
                    </div>
                  )}
                  <div 
                    className="absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: dog.status === 'available' 
                        ? 'var(--secondary-green)' 
                        : 'var(--accent-coral)',
                      color: 'white'
                    }}
                  >
                    {dog.status}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-dark)' }}>
                    {dog.name || 'Unnamed'}
                  </h3>
                  
                  <div className="space-y-1 mb-4 text-sm" style={{ color: 'var(--text-gray)' }}>
                    <p>Age: {dog.age || 'Unknown'}</p>
                    <p>Gender: {dog.gender || 'Unknown'}</p>
                    <p>Location: {dog.location || 'Not specified'}</p>
                    <div className="flex gap-2 mt-2">
                      {dog.vaccinated && (
                        <span 
                          className="px-2 py-1 rounded text-xs"
                          style={{ backgroundColor: 'var(--earthy-cream)', color: 'var(--text-dark)' }}
                        >
                          💉 Vaccinated
                        </span>
                      )}
                      {dog.sterilized && (
                        <span 
                          className="px-2 py-1 rounded text-xs"
                          style={{ backgroundColor: 'var(--primary-sky)', color: 'var(--text-dark)' }}
                        >
                          ✂️ Sterilized
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/admin/adoptions/edit/${dog.id}`} className="flex-1">
                      <button 
                        className="w-full px-4 py-2 rounded-lg font-medium text-sm"
                        style={{ 
                          backgroundColor: 'var(--primary-teal)',
                          color: 'white'
                        }}
                      >
                        ✏️ Edit
                      </button>
                    </Link>
                    <DeleteButton dogId={dog.id} dogName={dog.name} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🐕</div>
              <p className="text-xl mb-2" style={{ color: 'var(--text-dark)' }}>
                No dogs yet
              </p>
              <p style={{ color: 'var(--text-gray)' }}>
                Add your first dog to get started
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}