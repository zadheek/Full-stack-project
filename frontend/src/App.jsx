import React from 'react';
import {BrowserRouter as Router,Routes,Route,Navigate, useLocation,} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';

// Auth
import Auth from './pages/Auth';

// User Pages
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import Seats from './pages/Seats';
import Summary from './pages/Summary';
import Payment from './pages/Payment';
import Success from './pages/Success';
import MyBookings from './pages/MyBookings';
import Receipt from './pages/Receipt';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import Dashboard from './pages/admin/AdminDashboard/Dashboard';
import AdminMovies from './pages/admin/AdminMovies/Movies';
import AddMovie from './pages/admin/AddMovie';
import AdminShows from './pages/admin/AdminShows/Shows';
import AdminBookings from './pages/admin/AdminBookings/Bookings';

import './App.css';

/* =======================
   Protected Route
======================= */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/movies" />;
  }

  return children;
};

/* =======================
   Public Route
======================= */
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/movies" />;
  }

  return children;
};

/* =======================
   App Content
======================= */
function AppContent() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/auth';

  return (
    <div className="App">
      {/* Navbar: show on all user pages except admin and auth routes */}
      {!isAdminRoute && !isAuthRoute && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          }
        />

        {/* Backward compatibility */}
        <Route path="/login" element={<Navigate to="/auth" />} />
        <Route path="/register" element={<Navigate to="/auth" />} />

        {/* Movies */}
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />

        {/* Protected User Routes */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipt/:bookingId"
          element={
            <ProtectedRoute>
              <Receipt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seats/:showId"
          element={
            <ProtectedRoute>
              <Seats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminMovies />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/movies/add"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AddMovie />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/shows"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminShows />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout>
                <AdminBookings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Footer: hidden on admin and auth routes */}
      {!isAdminRoute && !isAuthRoute && <Footer />}
    </div>
  );
}

/* =======================
   App Wrapper
======================= */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1c1c1f',
              color: '#fafafa',
              border: '1px solid #27272a',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#1c1c1f',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1c1c1f',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;