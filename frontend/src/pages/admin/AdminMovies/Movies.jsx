import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { moviesAPI, uploadAPI } from '../../../services/api';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import Pagination from '../../../components/admin/Pagination';
import './AdminMovies.css';

const AdminMovies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(searchParams.get('add') === 'true');
  const [editingMovie, setEditingMovie] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, movieId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Simplified form data - no posterUrl or posterType
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    genre: '',
    language: '',
    releaseDate: '',
    rating: '',
    director: '',
    cast: '',
    status: 'upcoming'
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(''); // For edit mode

  useEffect(() => {
    fetchMovies();
  }, []);

  // Watch for URL query param changes to show/hide form
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowForm(true);
      setEditingMovie(null);
      // Clear the query param after opening the form
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await moviesAPI.getAllMovies();
      setMovies(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = existingImageUrl; // Use existing URL if editing

      // Upload new image if selected
      if (imageFile) {
        console.log('Uploading image...');
        const uploadResponse = await uploadAPI.uploadImage(imageFile);
        imageUrl = uploadResponse.data.data.url;
        console.log('Image uploaded:', imageUrl);
      }

      // Validate image URL
      if (!imageUrl) {
        toast.error('Please upload an image');
        setUploading(false);
        return;
      }

      // Prepare clean movie data
      const movieData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: Number(formData.duration),
        genre: formData.genre.split(',').map(g => g.trim()).filter(g => g),
        language: formData.language.trim(),
        releaseDate: formData.releaseDate,
        rating: Number(formData.rating),
        director: formData.director.trim(),
        cast: formData.cast.split(',').map(c => c.trim()).filter(c => c),
        status: formData.status,
        images: [{
          url: imageUrl,
          type: 'poster',
          isPrimary: true,
          altText: formData.title
        }],
        videos: []
      };

      console.log('Sending movie data:', movieData);

      if (editingMovie) {
        await moviesAPI.updateMovie(editingMovie._id, movieData);
        toast.success('Movie updated successfully!');
      } else {
        await moviesAPI.createMovie(movieData);
        toast.success('Movie created successfully!');
      }
      
      fetchMovies();
      resetForm();
    } catch (error) {
      console.error('Error details:', error.response || error);
      const errorMessage = error.response?.data?.message || error.message || 'Operation failed';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      duration: movie.duration,
      genre: movie.genre.join(', '),
      language: movie.language,
      releaseDate: movie.releaseDate.split('T')[0],
      rating: movie.rating,
      director: movie.director,
      cast: movie.cast.join(', '),
      status: movie.status
    });
    
    // Set existing image
    const existingImage = movie.images[0]?.url || '';
    setExistingImageUrl(existingImage);
    setImagePreview(existingImage);
    setImageFile(null);
    
    setShowForm(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteModal({ open: true, movieId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      await moviesAPI.deleteMovie(deleteModal.movieId);
      toast.success('Movie deleted successfully!');
      fetchMovies();
    } catch (error) {
      toast.error('Delete failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setDeleteModal({ open: false, movieId: null });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: '',
      genre: '',
      language: '',
      releaseDate: '',
      rating: '',
      director: '',
      cast: '',
      status: 'upcoming'
    });
    setEditingMovie(null);
    setShowForm(false);
    setImageFile(null);
    setImagePreview(null);
    setExistingImageUrl('');
  };

  const filteredMovies = movies.filter(movie =>
    movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre?.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="admin-movies-container">
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, movieId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Movie"
        message="Are you sure you want to delete this movie? This will also remove all associated shows and cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <div className="page-header">
        <div className="header-left">
          <h1>Manage Movies</h1>
          <p className="header-subtitle">Add, edit, and manage your movie catalog</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Movie'}
        </button>
      </div>

      {!showForm && (
        <div className="search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search by title, director, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {showForm && (
        <form className="movie-form" onSubmit={handleSubmit}>
          <h3>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
          
          {/* Image Upload Section */}
          <div className="image-upload-section">
            <label className="image-upload-label">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <div className="upload-box">
                {imagePreview ? (
                  <div className="preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <p className="change-image-hint">Click to change image</p>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon">+</span>
                    <p>Click to upload movie poster</p>
                    <p className="upload-hint">JPG, PNG or WEBP (Max 5MB)</p>
                    <p className="upload-hint">Recommended: 300×450 pixels</p>
                  </div>
                )}
              </div>
            </label>
            {imageFile && (
              <p className="file-selected">Selected: {imageFile.name}</p>
            )}
          </div>

          {/* Movie Details Form */}
          <div className="form-row">
            <input
              placeholder="Movie Title *"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
            <input
              placeholder="Duration (minutes) *"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              required
            />
          </div>

          <textarea
            placeholder="Movie Description *"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
            rows="4"
          />

          <div className="form-row">
            <input
              placeholder="Genre (comma separated) * e.g. Action, Thriller"
              value={formData.genre}
              onChange={(e) => setFormData({...formData, genre: e.target.value})}
              required
            />
            <input
              placeholder="Language * e.g. English"
              value={formData.language}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              required
            />
          </div>

          <div className="form-row">
            <input
              placeholder="Director *"
              value={formData.director}
              onChange={(e) => setFormData({...formData, director: e.target.value})}
              required
            />
            <input
              placeholder="Rating (0-10) *"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: e.target.value})}
              required
            />
          </div>

          <input
            placeholder="Cast (comma separated) * e.g. Actor 1, Actor 2"
            value={formData.cast}
            onChange={(e) => setFormData({...formData, cast: e.target.value})}
            required
          />

          <div className="form-row">
            <div className="form-group">
              <label>Release Date *</label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="upcoming">Upcoming</option>
                <option value="now-showing">Now Showing</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={uploading}>
            {uploading ? 'Uploading...' : (editingMovie ? 'Update Movie' : 'Add Movie')}
          </button>
        </form>
      )}

      <div className="table-card">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading movies...</p>
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
              <line x1="7" y1="2" x2="7" y2="22"/>
              <line x1="17" y1="2" x2="17" y2="22"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
            </svg>
            <p>{searchTerm ? 'No movies match your search' : 'No movies found. Add your first movie!'}</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Duration</th>
                <th>Genre</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMovies.map(movie => (
                <tr key={movie._id}>
                  <td>
                    <img 
                      src={movie.images[0]?.url || 'https://via.placeholder.com/60x90?text=No+Image'} 
                      alt={movie.title}
                      className="movie-thumbnail"
                      loading="lazy"
                      onError={(e) => e.target.src = 'https://via.placeholder.com/60x90?text=Error'}
                    />
                  </td>
                  <td className="movie-title-cell"><strong>{movie.title}</strong></td>
                  <td>{movie.duration} mins</td>
                  <td className="genre-cell">{movie.genre.join(', ')}</td>
                  <td><span className={`status-badge status-${movie.status}`}>{movie.status}</span></td>
                  <td><span className="rating-badge">{movie.rating}/10</span></td>
                  <td className="actions-cell">
                    <button className="btn-icon edit" onClick={() => handleEdit(movie)} title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="btn-icon delete" onClick={() => handleDeleteClick(movie._id)} title="Delete">
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

        {!loading && filteredMovies.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredMovies.length}
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

export default AdminMovies;