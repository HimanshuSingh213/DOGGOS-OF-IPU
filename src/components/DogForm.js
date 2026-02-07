'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function DogForm({ initialData = null, isEdit = false }) {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    breed: initialData?.breed || '',
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
  const [photoPreviews, setPhotoPreviews] = useState([]) // NEW: For preview
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
    const totalPhotos = existingPhotos.length + files.length

    // Validation: Max 5 photos total
    if (totalPhotos > 5) {
      setError(`Maximum 5 photos allowed. You already have ${existingPhotos.length} photo(s). You can select maximum ${5 - existingPhotos.length} more.`)
      e.target.value = '' // Reset input
      return
    }

    setError('')
    setPhotos(files)

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file))
    setPhotoPreviews(previews)
  }

  const removeNewPhoto = (index) => {
    const newPhotos = [...photos]
    const newPreviews = [...photoPreviews]
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(newPreviews[index])
    
    newPhotos.splice(index, 1)
    newPreviews.splice(index, 1)
    
    setPhotos(newPhotos)
    setPhotoPreviews(newPreviews)
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
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
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

      // Validation: At least 1 photo required
      if (photoUrls.length === 0) {
        throw new Error('At least 1 photo is required')
      }

      // Validation: Max 5 photos
      if (photoUrls.length > 5) {
        throw new Error('Maximum 5 photos allowed')
      }

      const dogData = {
        ...formData,
        photos: photoUrls
      }

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('adoptions')
          .update(dogData)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('adoptions')
          .insert([dogData])

        if (insertError) throw insertError
      }

      // Cleanup preview URLs
      photoPreviews.forEach(url => URL.revokeObjectURL(url))

      router.push('/admin/adoptions')
      router.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const totalPhotos = existingPhotos.length + photos.length
  const canAddMore = totalPhotos < 5
  const remainingSlots = 5 - existingPhotos.length

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-sm border" style={{ borderColor: 'var(--border-light)' }}>
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6" style={{ color: 'var(--text-dark)' }}>
        {isEdit ? 'Edit Dog Details' : 'Add New Dog'}
      </h2>

      {error && (
        <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4 sm:space-y-6">
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
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            placeholder="e.g., Buddy"
          />
        </div>
         {/* Breed Field */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            Breed
          </label>
          <input
            type="text"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            placeholder="e.g., Indie / Labrador"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Age
            </label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
              style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="vaccinated"
              checked={formData.vaccinated}
              onChange={handleChange}
              className="w-5 h-5"
              style={{ accentColor: 'var(--primary-teal)' }}
            />
            <span className="text-sm sm:text-base" style={{ color: 'var(--text-dark)' }}>💉 Vaccinated</span>
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
            <span className="text-sm sm:text-base" style={{ color: 'var(--text-dark)' }}>✂️ Sterilized</span>
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
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
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
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
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
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
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
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
            style={{ borderColor: 'var(--border-light)', color: 'var(--text-dark)' }}
          >
            <option value="available">Available</option>
            <option value="adopted">Adopted</option>
          </select>
        </div>

        {/* Existing Photos */}
        {existingPhotos.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              Current Photos ({existingPhotos.length}/5)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {existingPhotos.map((photo, idx) => (
                <div key={idx} className="relative group">
                  <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-24 sm:h-32 object-cover rounded-lg border-2" style={{ borderColor: 'var(--primary-teal)' }} />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(photo)}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs sm:text-sm font-bold"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded">
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Photos Preview */}
        {photoPreviews.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
              New Photos to Upload ({photoPreviews.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {photoPreviews.map((preview, idx) => (
                <div key={idx} className="relative group">
                  <img src={preview} alt={`New photo ${idx + 1}`} className="w-full h-24 sm:h-32 object-cover rounded-lg border-2 border-dashed" style={{ borderColor: 'var(--secondary-green)' }} />
                  <button
                    type="button"
                    onClick={() => removeNewPhoto(idx)}
                    className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs sm:text-sm font-bold"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-1 left-1 text-white text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--secondary-green)' }}>
                    NEW
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Photos */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-dark)' }}>
            {isEdit ? 'Add More Photos' : 'Upload Photos'} * (Total: {totalPhotos}/5)
          </label>
          
          <div 
            className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-opacity-80 transition-all"
            style={{ borderColor: canAddMore ? 'var(--primary-teal)' : 'var(--border-light)', backgroundColor: canAddMore ? 'var(--primary-sky)' : 'var(--base-white)' }}
            onClick={() => document.getElementById('photo-input').click()}
          >
            <input
              id="photo-input"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              disabled={!canAddMore}
              className="hidden"
            />
            
            <div className="text-4xl sm:text-5xl mb-2">📸</div>
            
            {canAddMore ? (
              <>
                <p className="text-sm sm:text-base font-medium mb-1" style={{ color: 'var(--text-dark)' }}>
                  Click to select photos
                </p>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--text-gray)' }}>
                  You can select up to {remainingSlots} more photo{remainingSlots !== 1 ? 's' : ''}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium" style={{ color: 'var(--accent-coral)' }}>
                Maximum limit reached (5/5)
              </p>
            )}
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-gray)' }}>
              • Select multiple photos at once (Hold Ctrl/Cmd)
            </p>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-gray)' }}>
              • Minimum: 1 photo required
            </p>
            <p className="text-xs sm:text-sm" style={{ color: 'var(--text-gray)' }}>
              • Maximum: 5 photos total
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full sm:flex-1 py-2.5 sm:py-3 rounded-lg font-medium disabled:opacity-50 text-sm sm:text-base"
            style={{ backgroundColor: 'var(--secondary-green)', color: 'white' }}
          >
            {loading ? 'Saving...' : uploading ? 'Uploading...' : isEdit ? 'Update Dog' : 'Add Dog'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base"
            style={{ backgroundColor: 'var(--border-light)', color: 'var(--text-dark)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}