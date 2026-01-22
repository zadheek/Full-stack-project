import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { moviesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [nowShowing, setNowShowing] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const [nowShowingRes, upcomingRes] = await Promise.all([
        moviesAPI.getNowShowing(),
        moviesAPI.getUpcoming()
      ]);
      setNowShowing(nowShowingRes.data.data.slice(0, 5));
      setUpcoming(upcomingRes.data.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPrimaryPoster = (movie) => {
    const primary = movie.images?.find(img => img.type === 'poster' && img.isPrimary);
    return primary?.url || movie.images?.find(img => img.type === 'poster')?.url || 'https://via.placeholder.com/300x450';
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="home-hero-overlay"></div>
        <div className="home-hero-content">
          <div className="home-hero-text">
            <h1 className="home-hero-title">Welcome to MOVIENEST</h1>
            <p className="home-hero-subtitle">
              Set more than a decade after the events of the first film, learn the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.
            </p>
            <div className="home-hero-buttons">
              {isAuthenticated ? (
                <button className="home-btn-primary" onClick={() => navigate('/movies')}>
                  Browse Movies
                </button>
              ) : (
                <>
                  <button className="home-btn-primary" onClick={() => navigate('/auth')}>
                    Get Started
                  </button>
                  <button className="home-btn-secondary" onClick={() => navigate('/about')}>
                    Learn More
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="home-hero-poster">
            <img 
              src="https://i.ebayimg.com/images/g/CwEAAOSwv4xf5cdv/s-l1200.jpg" 
              alt="Featured Movie" 
            />
          </div>
        </div>
        <div className="home-hero-dots">
          <button className="home-hero-dot active"></button>
          <button className="home-hero-dot"></button>
          <button className="home-hero-dot"></button>
        </div>
      </section>

      {/* Partners Bar */}
      <div className="home-partners-bar">
        <div className="home-partners-content">
          <span>SCOPE</span>
          <span>SAVOY</span>
          <span>PVR</span>
          <span>VOX Cinema</span>
        </div>
      </div>

      {/* Now Showing Section */}
      <section className="home-movies-section">
        <div className="home-section-header">
          <div>
            <h2>Now Showing 🎬</h2>
            <p className="home-section-subtitle">Browse now-showing movies near you.</p>
          </div>
          <Link to="/movies" className="home-view-all-link">View All →</Link>
        </div>
        {loading ? (
          <div className="home-loading">Loading...</div>
        ) : (
          <div className="home-movies-carousel">
            {nowShowing.map(movie => (
              <Link to={`/movies/${movie._id}`} key={movie._id} className="home-movie-card">
                <div className="home-movie-poster">
                  <img src={getPrimaryPoster(movie)} alt={movie.title} />
                  <div className="home-movie-rating-badge">★ {movie.rating}</div>
                </div>
                <div className="home-movie-info">
                  <h3>{movie.title}</h3>
                  <p className="home-movie-genre">{movie.genre.join(', ')}</p>
                  <div className="home-star-rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`home-star ${i < Math.floor(movie.rating) ? 'filled' : ''}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <button className="home-book-ticket-btn">Book Your Ticket</button>
                </div>
              </Link>
            ))}
          </div>
        )}
        <button className="home-explore-more-btn" onClick={() => navigate('/movies')}>
          Explore More
        </button>
      </section>

      {/* Coming Soon Section */}
      <section className="home-coming-soon-section">
        <div className="home-movies-section">
          <div className="home-section-header">
            <div>
              <h2>Coming Soon 🔜</h2>
              <p className="home-section-subtitle">Upcoming movies to watch out for.</p>
            </div>
            <Link to="/movies" className="home-view-all-link">View All →</Link>
          </div>
          {loading ? (
            <div className="home-loading">Loading...</div>
          ) : (
            <div className="home-movies-carousel">
              {upcoming.map(movie => (
                <Link to={`/movies/${movie._id}`} key={movie._id} className="home-movie-card">
                  <div className="home-movie-poster">
                    <img src={getPrimaryPoster(movie)} alt={movie.title} />
                    <div className="home-movie-rating-badge">★ {movie.rating}</div>
                  </div>
                  <div className="home-movie-info">
                    <h3>{movie.title}</h3>
                    <p className="home-movie-genre">{movie.genre.join(', ')}</p>
                    <div className="home-star-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`home-star ${i < Math.floor(movie.rating) ? 'filled' : ''}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <button className="home-book-ticket-btn">Book Your Ticket</button>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <button className="home-view-all-upcoming-btn" onClick={() => navigate('/movies')}>
            View All Upcoming
          </button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="home-testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="home-testimonials-grid">
          <div className="home-testimonial-card">
            <div className="home-testimonial-avatar"></div>
            <h3>John Dora</h3>
            <div className="home-testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="home-star filled">★</span>
              ))}
            </div>
            <p className="home-testimonial-text">
              MovieNest makes booking movie tickets super easy and fast. The interface is clean, and selecting seats takes just seconds. Highly recommended for hassle-free movie bookings!
            </p>
          </div>
          <div className="home-testimonial-card">
            <div className="home-testimonial-avatar"></div>
            <h3>John Cena</h3>
            <div className="home-testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="home-star filled">★</span>
              ))}
            </div>
            <p className="home-testimonial-text">
              I love how smooth and reliable MovieNest is! From browsing movies to confirming tickets, everything works perfectly. It's my go-to platform for booking cinema tickets.
            </p>
          </div>
          <div className="home-testimonial-card">
            <div className="home-testimonial-avatar"></div>
            <h3>Hasbullah</h3>
            <div className="home-testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="home-star filled">★</span>
              ))}
            </div>
            <p className="home-testimonial-text">
              MovieNest offers a great booking experience with clear showtimes and quick confirmation. It saves time and makes movie planning effortless. Excellent service!
            </p>
          </div>
        </div>
        <div className="home-testimonial-dots">
          <button className="home-testimonial-dot active"></button>
          <button className="home-testimonial-dot"></button>
          <button className="home-testimonial-dot"></button>
          <button className="home-testimonial-dot"></button>
          <button className="home-testimonial-dot"></button>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features-section">
        <h2>Why Choose MovieNest?</h2>
        <div className="home-features-grid">
          <div className="home-feature-card">
            <span className="home-feature-icon">🎟️</span>
            <h3>Easy Booking</h3>
            <p>Book your tickets in just a few clicks</p>
          </div>
          <div className="home-feature-card">
            <span className="home-feature-icon">💳</span>
            <h3>Secure Payment</h3>
            <p>Safe and secure online payment options</p>
          </div>
          <div className="home-feature-card">
            <span className="home-feature-icon">🎭</span>
            <h3>Multiple Cinemas</h3>
            <p>Choose from various cinema locations</p>
          </div>
          <div className="home-feature-card">
            <span className="home-feature-icon">⭐</span>
            <h3>Best Experience</h3>
            <p>Premium seats and excellent service</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;