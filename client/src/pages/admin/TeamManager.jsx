import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../utils/api'

export default function TeamManager() {
  const [team, setTeam] = useState([])
  const [form, setForm] = useState({ name: '', role: '', bio: '', linkedin: '', order: 0, image: '' })
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    setLoading(true)
    try {
      const response = await api.get('/team')
      setTeam(response.data)
    } catch (error) {
      console.error('Error fetching team:', error)
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
        await api.put(`/team/${editing}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Team member updated successfully!')
      } else {
        await api.post('/team', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success('Team member added successfully!')
      }
      
      setForm({ name: '', role: '', bio: '', linkedin: '', order: 0, image: '' })
      setEditing(null)
      setImageFile(null)
      setImagePreview(null)
      fetchTeam()
    } catch (error) {
      console.error('Error saving team member:', error)
      const errorMessage = error.response?.data?.message || 'Error saving team member. Please try again.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      linkedin: member.linkedin,
      order: member.order,
      image: member.image
    })
    setEditing(member._id)
    setImagePreview(member.image)
    setImageFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this team member?')) {
      setLoading(true)
      try {
        await api.delete(`/team/${id}`)
        toast.success('Team member deleted successfully!')
        fetchTeam()
      } catch (error) {
        console.error('Error deleting team member:', error)
        toast.error('Error deleting team member. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCancel = () => {
    setForm({ name: '', role: '', bio: '', linkedin: '', order: 0, image: '' })
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Manage Team</h1>
          <p className="text-gray-600 text-lg">Add and manage team members</p>
        </div>
        
        <motion.form 
          onSubmit={handleSubmit} 
          className="bg-white p-8 rounded-xl shadow-md mb-10 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editing ? 'Edit Team Member' : 'Add New Team Member'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input
                type="text"
                placeholder="Enter member name"
                required
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <input
                type="text"
                placeholder="e.g., President, Vice President"
                required
                value={form.role}
                onChange={(e) => setForm({...form, role: e.target.value})}
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="text"
                placeholder="https://linkedin.com/in/username"
                value={form.linkedin}
                onChange={(e) => setForm({...form, linkedin: e.target.value})}
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
              <input
                type="number"
                placeholder="0"
                value={form.order}
                onChange={(e) => setForm({...form, order: e.target.value})}
                className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              placeholder="Enter member bio"
              value={form.bio}
              onChange={(e) => setForm({...form, bio: e.target.value})}
              className="w-full px-5 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
              rows="4"
            />
          </div>

          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Photo</label>
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
              {loading ? 'Saving...' : editing ? 'Update Member' : 'Add Member'}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      Loading team members...
                    </td>
                  </tr>
                ) : team.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      No team members found. Add your first member!
                    </td>
                  </tr>
                ) : (
                  team.map((member, index) => (
                    <motion.tr 
                      key={member._id} 
                      className="hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-5 text-gray-900 font-medium">{member.name}</td>
                      <td className="px-6 py-5 text-gray-700">{member.role}</td>
                      <td className="px-6 py-5 text-gray-700">{member.order}</td>
                      <td className="px-6 py-5">
                        <button 
                          onClick={() => handleEdit(member)} 
                          className="text-blue-600 hover:text-blue-800 font-medium mr-5 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(member._id)} 
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
