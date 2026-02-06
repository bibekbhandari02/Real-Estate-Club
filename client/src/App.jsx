import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Events from './pages/Events'
import Team from './pages/Team'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Membership from './pages/Membership'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isLoginRoute = location.pathname === '/login'

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <ScrollToTop />
      {!isAdminRoute && !isLoginRoute && <Navbar />}
      <main className="flex-grow overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/team" element={<Team />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminRoute && !isLoginRoute && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppContent />
    </Router>
  )
}

export default App
