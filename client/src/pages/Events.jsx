import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from '../components/ScrollReveal'
import api from '../utils/api'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events')
      setEvents(response.data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const upcomingEvents = events.filter(e => e.status === 'upcoming')
  const pastEvents = events.filter(e => e.status === 'past')
  
  const displayEvents = filter === 'upcoming' ? upcomingEvents : filter === 'past' ? pastEvents : events

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
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
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2.5 mb-8 shadow-lg">
              <span className="text-2xl mr-2">📅</span>
              <span className="text-blue-100 font-bold text-sm md:text-base">Discover Our Events</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Upcoming Events
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-blue-100 max-w-4xl leading-relaxed font-light">
              Join us for workshops, networking sessions, and industry insights that will shape your real estate career
            </p>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Filter Tabs */}
        <ScrollReveal>
          <div className="flex flex-wrap gap-4 mb-12">
            {[
              { key: 'all', label: 'All Events', count: events.length },
              { key: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
              { key: 'past', label: 'Past Events', count: pastEvents.length }
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`relative px-8 py-3.5 rounded-xl font-bold transition-all text-base overflow-hidden group ${
                  filter === tab.key 
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300 shadow-md'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter === tab.key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                )}
                <span className="relative z-10">{tab.label}</span>
                <span className={`relative z-10 ml-2 ${filter === tab.key ? 'opacity-90' : 'opacity-60'}`}>
                  ({tab.count})
                </span>
              </motion.button>
            ))}
          </div>
        </ScrollReveal>

        {/* Events Grid */}
        {displayEvents.length === 0 ? (
          <ScrollReveal>
            <div className="text-center py-20 bg-white rounded-2xl shadow-md">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No events found</h3>
              <p className="text-gray-600 text-lg">Check back soon for upcoming events!</p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayEvents.map((event, index) => (
              <motion.div 
                key={event._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group ${
                  event.status === 'past' ? 'opacity-75' : ''
                }`}
              >
                <div className="relative overflow-hidden">
                  {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <svg className="w-20 h-20 text-white opacity-40 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xl backdrop-blur-md border ${
                      event.status === 'upcoming' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-400/30' 
                        : 'bg-gray-900/90 text-white border-gray-700/30'
                    }`}>
                      {event.status === 'upcoming' ? '🎯 Upcoming' : '📅 Past Event'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 md:p-7">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-blue-600 font-bold text-base md:text-lg">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 line-clamp-2 leading-tight">{event.title}</h3>
                  
                  <div className="space-y-2.5 mb-5">
                    {event.time && (
                      <div className="flex items-center text-gray-600 text-sm md:text-base">
                        <svg className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center text-gray-600 text-sm md:text-base">
                        <svg className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    )}
                    {event.speaker && (
                      <div className="flex items-center text-gray-600 text-sm md:text-base">
                        <svg className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {event.speaker}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 line-clamp-3 mb-5 leading-relaxed text-sm md:text-base">{event.description}</p>
                  
                  {event.status === 'upcoming' && (
                    <motion.button 
                      className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:via-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl text-base flex items-center justify-center space-x-2 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span>Register Now</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
