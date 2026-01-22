import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removeLoading, setRemoveLoading] = useState({});
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchFavorites();
  }, [isAuthenticated, navigate]);

  const fetchFavorites = async () => {
    try {
      const response = await favoritesAPI.getFavorites();
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();

    setRemoveLoading(prev => ({ ...prev, [movieId]: true }));

    try {
      await favoritesAPI.removeFromFavorites(movieId);
      setFavorites(prev => prev.filter(movie => movie._id !== movieId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error removing from favorites');
    } finally {
      setRemoveLoading(prev => ({ ...prev, [movieId]: false }));
    }
  };

  const getPrimaryPoster = (movie) => {
    if (!movie || !movie.images || movie.images.length === 0) {
      return 'https://via.placeholder.com/300x450?text=No+Image';
    }
    
    const primary = movie.images.find(img => img.type === 'poster' && img.isPrimary);
    const fallback = movie.images.find(img => img.type === 'poster');
    
    return primary?.url || fallback?.url || 'https://via.placeholder.com/300x450?text=No+Image';
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
  };

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>My Favorites</h1>
        {favorites.length > 0 && (
          <p className="favorites-count">
            {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'}
          </p>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h2>No favorites yet</h2>
          <p>Start adding movies to your favorites list!</p>
          <button className="btn-browse" onClick={() => navigate('/movies')}>
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((movie) => (
            <div key={movie._id} className="movie-card-wrapper">
              <Link to={`/movies/${movie._id}`} className="movie-card">
                <div className="movie-poster">
                  <img 
                    src={getPrimaryPoster(movie)} 
                    alt={movie.title}
                    onError={handleImageError}
                    loading="lazy"
                  />
                  <div className="movie-overlay">
                    <span className="rating">★ {movie.rating || 'N/A'}</span>
                  </div>
                </div>
                <div className="movie-info">
                  <h3 title={movie.title}>{movie.title}</h3>
                  <p className="genre">{movie.genre?.join(', ') || 'N/A'}</p>
                  <p className="duration">
                    {movie.duration ? `${movie.duration} min` : 'N/A'} • {movie.language || 'N/A'}
                  </p>
                </div>
              </Link>
              <button
                className="btn-remove-favorite"
                onClick={(e) => handleRemoveFavorite(e, movie._id)}
                disabled={removeLoading[movie._id]}
                title="Remove from favorites"
                aria-label="Remove from favorites"
              >
                {removeLoading[movie._id] ? (
                  <svg className="spinner-icon" width="20" height="20" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#e50914" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;