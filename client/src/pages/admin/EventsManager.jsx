import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../utils/api'

export default function EventsManager() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '', speaker: '', status: 'upcoming', image: '' })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await api.get('/events')
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      
      // Add form fields to FormData, excluding 'image' if we're uploading a file
      Object.keys(form).forEach(key => {
        if (key === 'image' && imageFile) {
          // Skip the image URL if we're uploading a new file
          return
        }
        if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
          formData.append(key, form[key])
        }
      })
      
      // Add the file if one was selected
      if (imageFile) {
        formData.append('image', imageFile)
      }

      if (editing) {
        await api.put(`/events/${editing}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Event updated successfully!')
      } else {
        await api.post('/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Event created successfully!')
      }
      
      setForm({ title: '', description: '', date: '', time: '', location: '', speaker: '', status: 'upcoming', image: '' })
      setEditing(null)
      setImageFile(null)
      setImagePreview(null)
      fetchEvents()
    } catch (error) {
      console.error('Error saving event:', error)
      const errorMessage = error.response?.data?.message || 'Error saving event. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      speaker: event.speaker,
      status: event.status,
      image: event.image
    })
    setEditing(event._id)
    setImagePreview(event.image)
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this event?')) {
      setLoading(true)
      try {
        await api.delete(`/events/${id}`)
        toast.success('Event deleted successfully!')
        fetchEvents()
      } catch (error) {
        console.error('Error deleting event:', error)
        toast.error('Error deleting event. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setForm({ title: '', description: '', date: '', time: '', location: '', speaker: '', status: 'upcoming', image: '' })
    setEditing(null)
    setImageFile(null)
    setImagePreview(null)
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Manage Events</h1>
          <p className="text-gray-600 text-lg">Create and manage club events</p>
        </div>
        
        <motion.form 
          onSubmit={handleSubmit} 
          className="bg-white p-8 rounded-xl shadow-md mb-10 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editing ? 'Edit Event' : 'Create New Event'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
              <input
                type="text"
                placeholder="Enter event title"
                required
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input
                type="text"
                placeholder="e.g., 6:00 PM - 8:00 PM"
                value={form.time}
                onChange={(e) => setForm({...form, time: e.target.value})}
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="Event location"
                value={form.location}
                onChange={(e) => setForm({...form, location: e.target.value})}
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Speaker</label>
              <input
                type="text"
                placeholder="Speaker name"
                value={form.speaker}
                onChange={(e) => setForm({...form, speaker: e.target.value})}
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({...form, status: e.target.value})}
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              >
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              placeholder="Enter event description"
              required
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              rows="4"
            />
          </div>

          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                      setForm({...form, image: ''})
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Image URL Input */}
              <div>
                <input
                  type="text"
                  placeholder="Enter image URL"
                  value={form.image}
                  onChange={(e) => {
                    setForm({...form, image: e.target.value})
                    if (e.target.value) {
                      setImagePreview(e.target.value)
                      setImageFile(null)
                    }
                  }}
                  className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : editing ? 'Update Event' : 'Create Event'}
            </button>
            {editing && (
              <button 
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-8 py-3.5 rounded-lg hover:bg-gray-300 transition-colors font-medium text-base"
              >
                Cancel
              </button>
            )}
          </div>
        </motion.form>

        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Loading events...
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      No events found. Create your first event!
                    </td>
                  </tr>
                ) : (
                  events.map((event, index) => (
                    <motion.tr 
                      key={event._id} 
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-5 text-gray-900 font-medium">{event.title}</td>
                      <td className="px-6 py-5 text-gray-700">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="px-6 py-5 text-gray-700">{event.location || '-'}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          event.status === 'upcoming' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <button 
                          onClick={() => handleEdit(event)} 
                          className="text-blue-600 hover:text-blue-800 font-medium mr-5 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(event._id)} 
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
