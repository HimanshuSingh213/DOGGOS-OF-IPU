'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function UpdatePassword() {
  const supabase = createClient()
  const router = useRouter()

  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        router.push('/') // if no session
      } else {
        setUserEmail(data.user.email)
      }
    }

    getUser()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password updated successfully!!!')

      setTimeout(() => {
        router.push('/')
      }, 1500)
    }

    setLoading(false)
  }

  return (
  <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-linear-to-br from-slate-900 to-slate-700">
    
    <div className="bg-white w-full max-w-md sm:max-w-lg p-6 sm:p-8 rounded-2xl shadow-2xl">
      
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
        Set Your New Password
      </h1>

      {userEmail && (
        <p className="text-center text-gray-500 text-xs sm:text-sm mb-6 break-all">
          Updating password for:
          <span className="block font-semibold text-gray-700 mt-1">
            {userEmail}
          </span>
        </p>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">

        <input
          type="password"
          placeholder="New Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-4 py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-100 text-green-600 px-4 py-2 rounded-lg text-sm">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>

      </form>
    </div>
  </div>
)

}
