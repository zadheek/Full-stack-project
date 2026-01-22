import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';
import logo from "../assets/Logo2.png";

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/auth');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo - Left Side */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="CinemaBook Logo" className="logo-icon" />
        </Link>

        {/* Mobile Toggle Button */}
        <button className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Navigation Menu - Right Side */}
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          
          <li>
            <Link 
              to="/movies" 
              className={isActive('/movies') ? 'active' : ''}
              onClick={closeMenu}
            >
              Movies
            </Link>
          </li>

          {isAuthenticated && !isAdmin && (
            <>
              <li>
                <Link 
                  to="/favorites" 
                  className={isActive('/favorites') ? 'active' : ''}
                  onClick={closeMenu}
                >
                  Favorites
                </Link>
              </li>
              <li>
                <Link 
                  to="/my-bookings" 
                  className={isActive('/my-bookings') ? 'active' : ''}
                  onClick={closeMenu}
                >
                  My Bookings
                </Link>
              </li>
            </>
          )}

          <li>
            <Link 
              to="/about" 
              className={isActive('/about') ? 'active' : ''}
              onClick={closeMenu}
            >
              About
            </Link>
          </li>
          
          <li>
            <Link 
              to="/contact" 
              className={isActive('/contact') ? 'active' : ''}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </li>

          {/* Auth Section */}
          {isAuthenticated ? (
            <>
              <li className="user-info">
                <span className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
                <div className="user-details">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-role">{user?.role}</span>
                </div>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link 
                to="/auth" 
                className="btn-auth"
                onClick={closeMenu}
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;