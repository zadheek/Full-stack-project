import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { moviesAPI, showsAPI } from '../services/api';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchMovieAndShows = useCallback(async () => {
    try {
      const movieResponse = await moviesAPI.getMovieById(id);
      setMovie(movieResponse.data.data);

      const showsResponse = await showsAPI.getShowsByMovie(id);
      setShows(showsResponse.data.data);

      if (showsResponse.data.data.length > 0) {
        const firstDate = new Date(showsResponse.data.data[0].showDate)
          .toISOString().split('T')[0];
        setSelectedDate(firstDate);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMovieAndShows();
  }, [fetchMovieAndShows]);

  const getPrimaryPoster = () => {
    const primary = movie?.images?.find(img => img.type === 'poster' && img.isPrimary);
    return primary?.url || movie?.images?.find(img => img.type === 'poster')?.url || 'https://via.placeholder.com/300x450?text=No+Image';
  };

  const getBackdrop = () => {
    const backdrop = movie?.images?.find(img => img.type === 'backdrop' && img.isPrimary);
    return backdrop?.url || movie?.images?.find(img => img.type === 'backdrop')?.url || getPrimaryPoster();
  };

  const getTrailer = () => {
    return movie?.videos?.find(vid => vid.type === 'trailer');
  };

  const filteredShows = shows.filter(show => {
    const showDate = new Date(show.showDate).toISOString().split('T')[0];
    return showDate === selectedDate;
  });

  const uniqueDates = [...new Set(shows.map(show => 
    new Date(show.showDate).toISOString().split('T')[0]
  ))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <p>Movie not found</p>
        <button onClick={() => navigate('/movies')} className="back-btn">
          Back to Movies
        </button>
      </div>
    );
  }

  return (
    <div className="movie-details">
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${getBackdrop()})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="poster-container">
              <img src={getPrimaryPoster()} alt={movie.title} className="movie-poster-large" />
            </div>
            <div className="movie-info-main">
              <h1 className="movie-title">{movie.title}</h1>
              <div className="movie-meta">
                <span className="rating-badge">★ {movie.rating}</span>
                <span className="meta-divider">•</span>
                <span>{movie.duration} min</span>
                <span className="meta-divider">•</span>
                <span>{movie.language}</span>
              </div>
              <div className="genre-tags">
                {movie.genre.map((g, index) => (
                  <span key={index} className="genre-tag">{g}</span>
                ))}
              </div>
              {/* DESCRIPTION WITH INLINE STYLE AS BACKUP */}
              <p className="movie-description" style={{ color: '#ffffff' }}>
                {movie.description}
              </p>
              <div className="movie-credits">
                <div className="credit-item">
                  <span className="credit-label">Director</span>
                  <span className="credit-value">{movie.director}</span>
                </div>
                <div className="credit-item">
                  <span className="credit-label">Cast</span>
                  <span className="credit-value">{movie.cast.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {getTrailer() && (
        <div className="trailer-section">
          <div className="section-container">
            <h2 className="section-title">Watch Trailer</h2>
            <div className="video-container">
              <video controls poster={getTrailer().thumbnailUrl} className="trailer-video">
                <source src={getTrailer().url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}

      {/* Showtimes Section */}
      <div className="showtimes-section">
        <div className="section-container">
          <h2 className="section-title">Book Tickets</h2>
          
          {shows.length === 0 ? (
            <div className="no-shows-message">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                <polyline points="17 2 12 7 7 2"></polyline>
              </svg>
              <p>No shows available for this movie</p>
              <button onClick={() => navigate('/movies')} className="back-to-movies-btn">
                Browse Other Movies
              </button>
            </div>
          ) : (
            <>
              <div className="date-selector">
                {uniqueDates.map(date => {
                  const dateObj = new Date(date);
                  return (
                    <button
                      key={date}
                      className={`date-btn ${selectedDate === date ? 'active' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className="date-day">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="date-date">{dateObj.getDate()}</span>
                      <span className="date-month">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>

              <div className="shows-grid">
                {filteredShows.map(show => (
                  <div key={show._id} className="show-card">
                    <div className="show-time">{show.showTime}</div>
                    <div className="show-details">
                      <div className="show-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        </svg>
                        <span>Screen {show.screen}</span>
                      </div>
                      <div className="show-detail-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>{show.availableSeats} seats</span>
                      </div>
                      <div className="show-price">Rs.{show.price}</div>
                    </div>
                    <button
                      className={`book-show-btn ${show.availableSeats === 0 ? 'sold-out' : ''}`}
                      onClick={() => navigate(`/seats/${show._id}`)}
                      disabled={show.availableSeats === 0}
                    >
                      {show.availableSeats === 0 ? 'Sold Out' : 'Select Seats'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;