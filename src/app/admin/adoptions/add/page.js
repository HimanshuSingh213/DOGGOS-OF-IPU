import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DogForm from '@/components/DogForm'
import Link from 'next/link'

export default async function AddDogPage() {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/admin" className="text-2xl">🐶</Link>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-dark)' }}>
                Add New Dog
              </h1>
            </div>
            <Link href="/admin/adoptions">
              <button 
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ 
                  backgroundColor: 'var(--primary-teal)',
                  color: 'white'
                }}
              >
                ← Back to List
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DogForm />
      </main>
    </div>
  )
}