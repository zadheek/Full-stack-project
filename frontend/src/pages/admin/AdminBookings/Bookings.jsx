import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { bookingsAPI } from '../../../services/api';
import Pagination from '../../../components/admin/Pagination';
import './AdminBookings.css';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await bookingsAPI.getAllBookings(params);
      setBookings(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 'confirmed': return 'status-success';
      case 'pending': return 'status-warning';
      case 'cancelled': return 'status-danger';
      case 'paid': return 'status-success';
      default: return '';
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="admin-bookings-container">
      <div className="page-header">
        <div className="header-left">
          <h1>Manage Bookings</h1>
          <p className="header-subtitle">View and manage all customer bookings</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by reference, user, or movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            <p>{searchTerm ? 'No bookings match your search' : 'No bookings found'}</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Movie</th>
                <th>Show Details</th>
                <th>Seats</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.map(booking => (
                <tr key={booking._id}>
                  <td className="reference-cell">
                    <span className="reference-code">{booking.bookingReference}</span>
                  </td>
                  <td className="customer-cell">
                    <span className="customer-name">{booking.user?.name}</span>
                    <span className="customer-email">{booking.user?.email}</span>
                  </td>
                  <td className="movie-cell">{booking.movie?.title}</td>
                  <td className="show-cell">
                    <span className="show-date">{new Date(booking.show?.showDate).toLocaleDateString()}</span>
                    <span className="show-time">{booking.show?.showTime}</span>
                  </td>
                  <td>
                    <span className="seats-badge">{booking.seats.map(s => s.seatNumber).join(', ')}</span>
                  </td>
                  <td className="amount-cell">${booking.totalAmount}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredBookings.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredBookings.length}
            onItemsPerPageChange={(value) => {
              setItemsPerPage(value);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminBookings;