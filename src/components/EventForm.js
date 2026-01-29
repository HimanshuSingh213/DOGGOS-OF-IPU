'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function EventForm({ initialData = null, isEdit = false }) {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    location: initialData?.location || '',
    event_type: initialData?.event_type || 'general',
    max_participants: initialData?.max_participants || '',
    contact_email: initialData?.contact_email || '',
    contact_phone: initialData?.contact_phone || '',
    status: initialData?.status || 'upcoming',
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialData?.image_url || null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      setError('')
      setImageFile(file)
      const preview = URL.createObjectURL(file)
      setImagePreview(preview)
    }
  }

  const removeImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
  }

  const uploadImage = async () => {
    if (!imageFile) return imagePreview

    setUploading(true)

    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `events/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('adoption-photos')
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('adoption-photos')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (err) {
      throw new Error('Image upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate date
      if (new Date(formData.date) < new Date().setHours(0, 0, 0, 0)) {
        throw new Error('Event date cannot be in the past')
      }

      // Upload image if new one selected
      const imageUrl = await uploadImage()

      const eventData = {
        ...formData,
        image_url: imageUrl,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
      }

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('events')
          .insert([eventData])

        if (insertError) throw insertError
      }

      // Cleanup preview URL
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }

      router.push('/admin/events')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border" style={{ borderColor: 'var(--border-light)' }}>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--text-dark)' }}>
        {isEdit ? 'Edit Event' : 'Add New Event'}
      </h2>

      {error && (
        <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            placeholder="e.g., Adoption Drive at IPU"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            maxLength={500}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            placeholder="Describe the event in detail..."
          />
          <p className="text-xs mt-1" style={{ color: 'var(--text-gray)' }}>
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            maxLength={100}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            placeholder="e.g., IPU Main Campus, Sector 16C Dwarka"
          />
        </div>

        {/* Event Type & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Event Type
            </label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            >
              <option value="general">General</option>
              <option value="adoption_drive">Adoption Drive</option>
              <option value="fundraiser">Fundraiser</option>
              <option value="awareness">Awareness Campaign</option>
              <option value="training">Training Session</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Max Participants */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            Maximum Participants (optional)
          </label>
          <input
            type="number"
            name="max_participants"
            value={formData.max_participants}
            onChange={handleChange}
            min="1"
            max="10000"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            placeholder="e.g., 50"
          />
          <p className="text-xs mt-1" style={{ color: 'var(--text-gray)' }}>
            Leave empty for unlimited participants
          </p>
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Contact Email
            </label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              placeholder="contact@doggos-ipu.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Contact Phone
            </label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              maxLength={15}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              placeholder="+91 1234567890"
            />
          </div>
        </div>

        {/* Current Event Image */}
        {imagePreview && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Current Image
            </label>
            <div className="relative group w-full max-w-md">
              <img 
                src={imagePreview} 
                alt="Event" 
                className="w-full h-48 object-cover rounded-lg border-2" 
                style={{ borderColor: 'var(--primary-teal)' }} 
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm font-bold shadow-lg"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Upload Image */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            {imagePreview ? 'Change Event Image' : 'Upload Event Image'}
          </label>
          
          <div 
            className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-opacity-80 transition-all"
            style={{ borderColor: 'var(--primary-teal)', backgroundColor: 'var(--primary-sky)' }}
            onClick={() => document.getElementById('image-input').click()}
          >
            <input
              id="image-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="text-4xl sm:text-5xl mb-2">🖼️</div>
            <p className="text-sm sm:text-base font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
              Click to select image
            </p>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-gray)' }}>
              Recommended: 1200x600px • Max 5MB
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full sm:flex-1 py-2.5 sm:py-3 rounded-lg font-medium disabled:opacity-50 text-sm sm:text-base hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--secondary-yellow)', color: 'var(--text-dark)' }}
          >
            {loading ? 'Saving...' : uploading ? 'Uploading Image...' : isEdit ? 'Update Event' : 'Add Event'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading || uploading}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--border-light)', color: 'var(--text-dark)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}