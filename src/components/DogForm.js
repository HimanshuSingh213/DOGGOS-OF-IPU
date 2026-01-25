'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DogForm({ initialData = null, isEdit = false }) {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    age: initialData?.age || '',
    gender: initialData?.gender || 'male',
    vaccinated: initialData?.vaccinated || false,
    sterilized: initialData?.sterilized || false,
    traits: initialData?.traits || '',
    favorite_food: initialData?.favorite_food || '',
    location: initialData?.location || '',
    status: initialData?.status || 'available',
  })

  const [photos, setPhotos] = useState([])
  const [existingPhotos, setExistingPhotos] = useState(initialData?.photos || [])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setPhotos(files)
  }

  const removeExistingPhoto = (photoUrl) => {
    setExistingPhotos(prev => prev.filter(p => p !== photoUrl))
  }

  const uploadPhotos = async () => {
    if (photos.length === 0) return existingPhotos

    setUploading(true)
    const uploadedUrls = [...existingPhotos]

    try {
      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('adoption-photos')
          .upload(filePath, photo)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('adoption-photos')
          .getPublicUrl(filePath)

        uploadedUrls.push(data.publicUrl)
      }

      return uploadedUrls
    } catch (err) {
      throw new Error('Photo upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Upload photos
      const photoUrls = await uploadPhotos()

      const dogData = {
        ...formData,
        photos: photoUrls
      }

      if (isEdit) {
        // Update existing dog
        const { error: updateError } = await supabase
          .from('adoptions')
          .update(dogData)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        // Insert new dog
        const { error: insertError } = await supabase
          .from('adoptions')
          .insert([dogData])

        if (insertError) throw insertError
      }

      router.push('/admin/adoptions')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border" style={{ borderColor: 'var(--border-light)' }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-dark)' }}>
        {isEdit ? 'Edit Dog Details' : 'Add New Dog'}
      </h2>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            placeholder="e.g., Buddy"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Age
            </label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
              placeholder="e.g., 2 years"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="vaccinated"
              checked={formData.vaccinated}
              onChange={handleChange}
              className="w-5 h-5"
              style={{ accentColor: 'var(--primary-teal)' }}
            />
            <span style={{ color: 'var(--text-dark)' }}>💉 Vaccinated</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="sterilized"
              checked={formData.sterilized}
              onChange={handleChange}
              className="w-5 h-5"
              style={{ accentColor: 'var(--primary-teal)' }}
            />
            <span style={{ color: 'var(--text-dark)' }}>✂️ Sterilized</span>
          </label>
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
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            placeholder="e.g., IPU Campus"
          />
        </div>

        {/* Traits */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            Traits
          </label>
          <textarea
            name="traits"
            value={formData.traits}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            placeholder="e.g., Friendly, playful, loves kids"
          />
        </div>

        {/* Favorite Food */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            Favorite Food
          </label>
          <input
            type="text"
            name="favorite_food"
            value={formData.favorite_food}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            placeholder="e.g., Chicken, biscuits"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
          >
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Existing Photos */}
        {existingPhotos.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Current Photos
            </label>
            <div className="grid grid-cols-3 gap-4">
              {existingPhotos.map((photo, idx) => (
                <div key={idx} className="relative group">
                  <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(photo)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Photos */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            {isEdit ? 'Add More Photos' : 'Upload Photos'}
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border rounded-lg"
            style={{ borderColor: 'var(--border-light)' }}
          />
          {photos.length > 0 && (
            <p className="text-sm mt-2" style={{ color: 'var(--text-gray)' }}>
              {photos.length} file(s) selected
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 py-3 rounded-lg font-medium disabled:opacity-50"
            style={{ backgroundColor: 'var(--secondary-green)', color: 'white' }}
          >
            {loading ? 'Saving...' : uploading ? 'Uploading...' : isEdit ? 'Update Dog' : 'Add Dog'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg font-medium"
            style={{ backgroundColor: 'var(--border-light)', color: 'var(--text-dark)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}