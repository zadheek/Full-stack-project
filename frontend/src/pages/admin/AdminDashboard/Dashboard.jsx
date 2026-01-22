// frontend/src/pages/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import { bookingsAPI, moviesAPI, showsAPI } from '../../../services/api';
import './AdminDashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalShows: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [moviesRes, showsRes, bookingsRes] = await Promise.all([
        moviesAPI.getAllMovies(),
        showsAPI.getAllShows(),
        bookingsAPI.getAllBookings()
      ]);

      const bookings = bookingsRes.data.data;
      const revenue = bookings
        .filter(b => b.paymentStatus === 'completed')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      setStats({
        totalMovies: moviesRes.data.count,
        totalShows: showsRes.data.count,
        totalBookings: bookings.length,
        totalRevenue: revenue
      });

      setRecentBookings(bookings.slice(0, 8));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span className="loading-text">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back! Here's what's happening with your cinema.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon movies">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>
          </div>
          <div className="stat-content">
            <h2 className="stat-value">{stats.totalMovies}</h2>
            <p className="stat-label">Total Movies</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon users">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h2 className="stat-value">{stats.totalShows}</h2>
            <p className="stat-label">Active Shows</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bookings">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 12v10H4V12"></path>
              <path d="M2 7h20v5H2z"></path>
              <path d="M12 22V7"></path>
              <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
              <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h2 className="stat-value">{stats.totalBookings}</h2>
            <p className="stat-label">Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stat-content">
            <h2 className="stat-value">Rs. {stats.totalRevenue.toLocaleString()}</h2>
            <p className="stat-label">Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="table-card">
        <div className="table-header">
          <h2>Recent Orders</h2>
          <select defaultValue="week">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Reference No</th>
                <th>Movie</th>
                <th>Customer</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? (
                recentBookings.map(booking => (
                  <tr key={booking._id}>
                    <td className="reference-cell">{booking.bookingReference}</td>
                    <td className="movie-cell">{booking.movie?.title || 'N/A'}</td>
                    <td>{booking.user?.name || 'Guest'}</td>
                    <td>{booking.seats?.length || 0}</td>
                    <td className="amount-cell">Rs. {booking.totalAmount?.toLocaleString()}</td>
                    <td>
                      <span className={`status-pill ${booking.paymentStatus}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <p>No recent bookings found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
