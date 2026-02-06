import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../utils/api'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      const response = await api.get('/gallery')
      setImages(response.data.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error('Error fetching gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', ...new Set(images.map(img => img.category).filter(Boolean))]
  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-20">
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 text-white py-24 md:py-32 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2.5 mb-8 shadow-lg">
              <span className="text-2xl mr-2">📸</span>
              <span className="text-blue-100 font-bold text-sm md:text-base">Our Moments</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Gallery
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-blue-100 max-w-4xl mx-auto leading-relaxed font-light">
              Explore moments from our events, workshops, and community activities
            </p>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-4 mb-10 justify-center">
            {categories.map(category => (
              <motion.button
                key={category}
                onClick={() => setFilter(category)}
                className={`relative px-8 py-3.5 rounded-xl font-bold transition-all text-base overflow-hidden group capitalize ${
                  filter === category 
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 shadow-md'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter === category && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                )}
                <span className="relative z-10">{category}</span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {filteredImages.length === 0 ? (
          <motion.div 
            className="text-center py-20 bg-white rounded-2xl shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No images yet</h3>
            <p className="text-gray-600 text-lg">Check back soon for photos from our events!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((item, index) => (
              <motion.div 
                key={item._id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                  <img 
                    src={item.image} 
                    alt={item.title || 'Gallery image'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {(item.title || item.category) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title && <p className="font-bold text-lg mb-1">{item.title}</p>}
                      {item.category && (
                        <p className="text-sm text-blue-200 capitalize font-medium">{item.category}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* View Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all border border-white/20 hover:border-white/40"
              onClick={() => setSelectedImage(null)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-6xl max-h-full" 
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage.image} 
                alt={selectedImage.title || 'Gallery image'} 
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
              {(selectedImage.title || selectedImage.category) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/95 backdrop-blur-md p-6 mt-6 rounded-2xl shadow-xl border border-gray-200"
                >
                  {selectedImage.title && <h3 className="text-2xl font-bold mb-2 text-gray-900">{selectedImage.title}</h3>}
                  {selectedImage.category && <p className="text-gray-600 capitalize font-medium">{selectedImage.category}</p>}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
