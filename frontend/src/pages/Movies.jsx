import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { moviesAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [filter, setFilter] = useState('now-showing');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const { isAuthenticated } = useAuth();

  // Fetch movies based on filter
  useEffect(() => {
    const fetchMoviesData = async () => {
      setLoading(true);
      try {
        let response;
        if (filter === 'now-showing') {
          response = await moviesAPI.getNowShowing();
        } else if (filter === 'upcoming') {
          response = await moviesAPI.getUpcoming();
        } else {
          response = await moviesAPI.getAllMovies({ status: filter });
        }
        setAllMovies(response.data.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setAllMovies([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMoviesData();
  }, [filter]);

  // Fetch favorites when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const fetchFavoritesData = async () => {
        try {
          const response = await favoritesAPI.getFavorites();
          const favoriteIds = response.data.data.map(movie => movie._id);
          setFavorites(favoriteIds);
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setFavorites([]);
        }
      };
      
      fetchFavoritesData();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  // FIXED: Use useMemo to optimize filtering
  const filteredMovies = useMemo(() => {
    if (searchTerm.trim() === '') {
      return allMovies;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return allMovies.filter(movie =>
      movie.title.toLowerCase().includes(searchLower) ||
      (movie.genre && movie.genre.some(g => g.toLowerCase().includes(searchLower))) ||
      (movie.director && movie.director.toLowerCase().includes(searchLower)) ||
      (movie.description && movie.description.toLowerCase().includes(searchLower))
    );
  }, [searchTerm, allMovies]);

  // Update movies when filteredMovies changes
  useEffect(() => {
    setMovies(filteredMovies);
  }, [filteredMovies]);

  const toggleFavorite = async (e, movieId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }

    setFavoriteLoading(prev => ({ ...prev, [movieId]: true }));

    try {
      const isFavorite = favorites.includes(movieId);

      if (isFavorite) {
        await favoritesAPI.removeFromFavorites(movieId);
        setFavorites(prev => prev.filter(id => id !== movieId));
      } else {
        await favoritesAPI.addToFavorites(movieId);
        setFavorites(prev => [...prev, movieId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert(error.response?.data?.message || 'Error updating favorites');
    } finally {
      setFavoriteLoading(prev => ({ ...prev, [movieId]: false }));
    }
  };

  // FIXED: Better error handling for poster images
  const getPrimaryPoster = (movie) => {
    if (!movie.images || movie.images.length === 0) {
      return 'https://via.placeholder.com/300x450?text=No+Image';
    }
    
    const primary = movie.images.find(img => img.type === 'poster' && img.isPrimary);
    const fallback = movie.images.find(img => img.type === 'poster');
    
    return primary?.url || fallback?.url || 'https://via.placeholder.com/300x450?text=No+Image';
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const isFavorite = (movieId) => {
    return favorites.includes(movieId);
  };

  // FIXED: Image error handler
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
  };

  return (
    <div className="movies-container">
      <div className="movies-header">
        <h1>Movies</h1>
        
        <div className="search-filter-container">
          <div className="search-bar">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search by title, genre, director..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={clearSearch} aria-label="Clear search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          <div className="filter-buttons">
            <button
              className={filter === 'now-showing' ? 'active' : ''}
              onClick={() => setFilter('now-showing')}
            >
              Now Showing
            </button>
            <button
              className={filter === 'upcoming' ? 'active' : ''}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
          </div>
        </div>

        {searchTerm && (
          <p className="search-results">
            {movies.length} movie{movies.length !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading movies...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="no-results">
          <p>No movies found</p>
          {searchTerm && (
            <button className="btn-clear" onClick={clearSearch}>Clear Search</button>
          )}
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie) => (
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
              {isAuthenticated && (
                <button
                  className={`btn-favorite ${isFavorite(movie._id) ? 'active' : ''}`}
                  onClick={(e) => toggleFavorite(e, movie._id)}
                  disabled={favoriteLoading[movie._id]}
                  title={isFavorite(movie._id) ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label={isFavorite(movie._id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {favoriteLoading[movie._id] ? (
                    <svg className="spinner-icon" width="20" height="20" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(movie._id) ? '#e50914' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Movies;