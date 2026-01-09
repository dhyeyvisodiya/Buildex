import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import PropertyList from './pages/PropertyList'
import PropertyDetail from './pages/PropertyDetail'
import CompareProperties from './pages/CompareProperties'
import Wishlist from './pages/Wishlist'
import UserDashboard from './pages/UserDashboard'
import BuilderDashboard from './pages/BuilderDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [compareList, setCompareList] = useState([])
  const [wishlist, setWishlist] = useState([])
  const { currentUser, logout } = useAuth()

  const navigateTo = (page, property = null) => {
    setCurrentPage(page)
    if (property) setSelectedProperty(property)
  }

  const addToCompare = (property) => {
    if (compareList.length < 3 && !compareList.find(p => p.id === property.id)) {
      setCompareList([...compareList, property])
    }
  }

  const removeFromCompare = (propertyId) => {
    setCompareList(compareList.filter(p => p.id !== propertyId))
  }

  const addToWishlist = (property) => {
    if (!wishlist.find(p => p.id === property.id)) {
      setWishlist([...wishlist, property])
    }
  }

  const removeFromWishlist = (propertyId) => {
    setWishlist(wishlist.filter(p => p.id !== propertyId))
  }

  const handleLoginSuccess = (user) => {
    // Navigate to appropriate dashboard based on user role
    if (user.role === 'admin') {
      navigateTo('admin-dashboard')
    } else if (user.role === 'builder') {
      navigateTo('builder-dashboard')
    } else {
      navigateTo('user-dashboard')
    }
  }

  const handleRegisterSuccess = (user) => {
    // Navigate to appropriate dashboard based on user role
    if (user.role === 'admin') {
      navigateTo('admin-dashboard')
    } else if (user.role === 'builder') {
      navigateTo('builder-dashboard')
    } else {
      navigateTo('user-dashboard')
    }
  }

  const handleLogout = () => {
    logout()
    navigateTo('home')
  }

  // If user is not logged in and trying to access protected pages, redirect to login
  if (!currentUser && (currentPage === 'user-dashboard' || currentPage === 'builder-dashboard' || currentPage === 'admin-dashboard')) {
    setCurrentPage('login')
  }

  const renderPage = () => {
    // Handle authentication pages
    if (currentPage === 'login') {
      return <Login onLoginSuccess={handleLoginSuccess} navigateTo={navigateTo} />
    }

    if (currentPage === 'register') {
      return <Register onRegisterSuccess={handleRegisterSuccess} navigateTo={navigateTo} />
    }

    if (currentPage === 'forgot-password') {
      return <ForgotPassword navigateTo={navigateTo} />
    }

    // If user is not logged in, show login page for protected routes
    if (!currentUser && (currentPage === 'user-dashboard' || currentPage === 'builder-dashboard' || currentPage === 'admin-dashboard')) {
      return <Login onLoginSuccess={handleLoginSuccess} />
    }

    // Show appropriate dashboard based on user role
    if (currentPage === 'user-dashboard' && currentUser?.role !== 'user' && currentUser?.role !== 'admin') {
      return <Login onLoginSuccess={handleLoginSuccess} />
    }

    if (currentPage === 'builder-dashboard' && currentUser?.role !== 'builder' && currentUser?.role !== 'admin') {
      return <Login onLoginSuccess={handleLoginSuccess} />
    }

    if (currentPage === 'admin-dashboard' && currentUser?.role !== 'admin') {
      return <Login onLoginSuccess={handleLoginSuccess} />
    }

    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />
      case 'property-list':
        return <PropertyList navigateTo={navigateTo} addToCompare={addToCompare} addToWishlist={addToWishlist} />
      case 'property-detail':
        return <PropertyDetail property={selectedProperty} navigateTo={navigateTo} addToCompare={addToCompare} addToWishlist={addToWishlist} />
      case 'compare':
        return <CompareProperties compareList={compareList} removeFromCompare={removeFromCompare} navigateTo={navigateTo} />
      case 'wishlist':
        return <Wishlist wishlist={wishlist} removeFromWishlist={removeFromWishlist} navigateTo={navigateTo} />
      case 'user-dashboard':
        return <UserDashboard wishlist={wishlist} navigateTo={navigateTo} />
      case 'builder-dashboard':
        return <BuilderDashboard />
      case 'admin-dashboard':
        return <AdminDashboard />
      default:
        return <Home navigateTo={navigateTo} />
    }
  }

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        currentPage={currentPage}
        navigateTo={navigateTo}
        compareCount={compareList.length}
        wishlistCount={wishlist.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main style={{ flex: '1' }}>
        {renderPage()}
      </main>
      <Footer navigateTo={navigateTo} />
      <BackToTop />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App