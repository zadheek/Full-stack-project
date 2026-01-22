import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { moviesAPI, uploadAPI } from '../../services/api';
import './AddMovie.css';

const AddMovie = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      alert('Please upload a movie poster');
      return;
    }

    setUploading(true);

    try {
      // Upload image
      const uploadResponse = await uploadAPI.uploadImage(imageFile);
      const imageUrl = uploadResponse.data.data.url;

      // Prepare movie data
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

      await moviesAPI.createMovie(movieData);
      alert('✅ Movie added successfully!');
      navigate('/admin/movies');
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + (error.response?.data?.message || 'Failed to add movie'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-movie-page">
      <div className="page-header">
        <h1>➕ Add New Movie</h1>
        <button className="btn-back" onClick={() => navigate('/admin/movies')}>
          ← Back to Movies
        </button>
      </div>

      <form className="add-movie-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Image Upload */}
          <div className="form-section full-width">
            <h3>Movie Poster</h3>
            <label className="image-upload-box">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              {imagePreview ? (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" />
                  <p className="change-hint">Click to change</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <p>Click to upload poster</p>
                  <p className="upload-hint">JPG, PNG or WEBP (Max 5MB)</p>
                </div>
              )}
            </label>
          </div>

          {/* Basic Info */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-field">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter movie title"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Duration (minutes) *</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="120"
                />
              </div>
              <div className="form-field">
                <label>Rating (0-10) *</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  required
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="8.5"
                />
              </div>
            </div>

            <div className="form-field">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter movie description"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="form-section">
            <h3>Additional Details</h3>
            <div className="form-field">
              <label>Genre (comma separated) *</label>
              <input
                type="text"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                placeholder="Action, Thriller, Sci-Fi"
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Language *</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  required
                  placeholder="English"
                />
              </div>
              <div className="form-field">
                <label>Release Date *</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label>Director *</label>
              <input
                type="text"
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
                placeholder="Christopher Nolan"
              />
            </div>

            <div className="form-field">
              <label>Cast (comma separated) *</label>
              <input
                type="text"
                name="cast"
                value={formData.cast}
                onChange={handleChange}
                required
                placeholder="Actor 1, Actor 2, Actor 3"
              />
            </div>

            <div className="form-field">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="now-showing">Now Showing</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate('/admin/movies')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={uploading}
          >
            {uploading ? '⏳ Adding Movie...' : '✓ Add Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;