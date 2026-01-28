'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteEventButton({ eventId, eventTitle }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    // Confirmation dialog
    const confirmMessage = `Are you sure you want to delete this event?\n\n"${eventTitle}"\n\nThis action cannot be undone.`
    
    if (!confirm(confirmMessage)) {
      return
    }

    setLoading(true)

    try {
      // Delete from database
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      // Refresh the page to show updated list
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting event: ' + error.message)
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
      style={{
        backgroundColor: 'var(--accent-coral)',
        color: 'white',
      }}
      title={`Delete ${eventTitle}`}
    >
      <span className="hidden sm:inline">{loading ? 'Deleting...' : '🗑️ Delete'}</span>
      <span className="sm:hidden">{loading ? '⏳' : '🗑️'}</span>
    </button>
  )
}