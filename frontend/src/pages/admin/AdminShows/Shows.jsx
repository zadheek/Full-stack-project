import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { showsAPI, moviesAPI } from '../../../services/api';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import Pagination from '../../../components/admin/Pagination';
import './AdminShows.css';

const AdminShows = () => {
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, showId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    movie: '', showDate: '', showTime: '', screen: '',
    totalSeats: '', price: ''
  });

  useEffect(() => {
    fetchShows();
    fetchMovies();
  }, []);

  const fetchShows = async () => {
    setLoading(true);
    try {
      const response = await showsAPI.getAllShows();
      setShows(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch shows');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await moviesAPI.getAllMovies();
      setMovies(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch movies');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const showData = {
      ...formData,
      totalSeats: Number(formData.totalSeats),
      price: Number(formData.price)
    };

    try {
      if (editingShow) {
        await showsAPI.updateShow(editingShow._id, showData);
        toast.success('Show updated successfully');
      } else {
        await showsAPI.createShow(showData);
        toast.success('Show created successfully');
      }
      fetchShows();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (show) => {
    setEditingShow(show);
    setFormData({
      movie: show.movie._id,
      showDate: show.showDate.split('T')[0],
      showTime: show.showTime,
      screen: show.screen,
      totalSeats: show.totalSeats,
      price: show.price
    });
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ open: true, showId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await showsAPI.deleteShow(deleteModal.showId);
      toast.success('Show deleted successfully');
      fetchShows();
    } catch (error) {
      toast.error('Failed to delete show');
    } finally {
      setDeleteModal({ open: false, showId: null });
    }
  };

  const resetForm = () => {
    setFormData({
      movie: '', showDate: '', showTime: '', screen: '',
      totalSeats: '', price: ''
    });
    setEditingShow(null);
    setShowForm(false);
  };

  const filteredShows = shows.filter(show => 
    show.movie?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    show.screen?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredShows.length / itemsPerPage);
  const paginatedShows = filteredShows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="admin-shows-container">
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, showId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Show"
        message="Are you sure you want to delete this show? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <div className="page-header">
        <div className="header-left">
          <h1>Manage Shows</h1>
          <p className="header-subtitle">Schedule and manage movie showtimes</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Show'}
        </button>
      </div>

      <div className="search-bar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search by movie or screen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="form-card">
          <h2 className="form-title">{editingShow ? 'Edit Show' : 'Add New Show'}</h2>
          <form className="show-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Movie</label>
              <select
                value={formData.movie}
                onChange={(e) => setFormData({...formData, movie: e.target.value})}
                required
              >
                <option value="">Select Movie</option>
                {movies.map(movie => (
                  <option key={movie._id} value={movie._id}>{movie.title}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Show Date</label>
                <input
                  type="date"
                  value={formData.showDate}
                  onChange={(e) => setFormData({...formData, showDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Show Time</label>
                <input
                  type="time"
                  value={formData.showTime}
                  onChange={(e) => setFormData({...formData, showTime: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Screen</label>
                <input
                  placeholder="e.g., Screen 1"
                  value={formData.screen}
                  onChange={(e) => setFormData({...formData, screen: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Seats</label>
                <input
                  placeholder="e.g., 100"
                  type="number"
                  value={formData.totalSeats}
                  onChange={(e) => setFormData({...formData, totalSeats: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                placeholder="e.g., 12.99"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingShow ? 'Update Show' : 'Add Show'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading shows...</p>
          </div>
        ) : filteredShows.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <p>{searchTerm ? 'No shows match your search' : 'No shows scheduled yet'}</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Date</th>
                <th>Time</th>
                <th>Screen</th>
                <th>Seats</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedShows.map(show => (
                <tr key={show._id}>
                  <td className="movie-cell">{show.movie?.title}</td>
                  <td>{new Date(show.showDate).toLocaleDateString()}</td>
                  <td>{show.showTime}</td>
                  <td><span className="badge">{show.screen}</span></td>
                  <td>
                    <span className={`seats-info ${show.availableSeats === 0 ? 'sold-out' : ''}`}>
                      {show.availableSeats}/{show.totalSeats}
                    </span>
                  </td>
                  <td className="price-cell">${show.price}</td>
                  <td className="actions-cell">
                    <button className="btn-icon edit" onClick={() => handleEdit(show)} title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDeleteClick(show._id)} title="Delete">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filteredShows.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredShows.length}
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

export default AdminShows;