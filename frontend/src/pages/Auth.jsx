import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';
import logo from '../assets/logo.png';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animationClass, setAnimationClass] = useState('fade-in');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nicPassport: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(loginData.email, loginData.password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/'); // Redirect to home page
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!registerData.fullName || !registerData.email || !registerData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: registerData.fullName,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password
      });
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle switch between login and signup with animation
  const switchToSignup = () => {
    setAnimationClass('slide-from-right');
    setTimeout(() => {
      setIsLogin(false);
      setError('');
    }, 0);
  };

  const switchToLogin = () => {
    setAnimationClass('slide-from-left');
    setTimeout(() => {
      setIsLogin(true);
      setError('');
    }, 0);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {isLogin ? (
          /* --- LOG IN VIEW --- */
          <div className={`auth-wrapper ${animationClass}`}>
            {/* Left Side - Welcome Panel */}
            <div className="welcome-panel welcome-panel-left">
              <img src={logo} alt="MovieNest Logo" className="logo-img" />
              <h2 className="welcome-subtitle">Welcome Back</h2>
              <h1 className="brand-name">MovieNest</h1>
              <p className="welcome-text">
                We're delighted to see you again! As a valued member, you have easy access to all our services and special offers.
              </p>
              <button className="switch-btn" onClick={switchToSignup}>
                Sign Up
              </button>
            </div>

            {/* Right Side - Login Form */}
            <div className="form-panel">
              <h1 className="form-title">LOG IN</h1>
              
              <div className="social-login">
                <button className="social-btn">
                  <i className="fa-brands fa-facebook"></i>
                </button>
                <button className="social-btn">
                  <i className="fa-brands fa-apple"></i>
                </button>
                <button className="social-btn">
                  <i className="fa-brands fa-google"></i>
                </button>
              </div>

              <p className="divider-text">or use your email & password</p>

              {error && <div className="error-message">{error}</div>}

              <form className="auth-form" onSubmit={handleLoginSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                  className="input-field"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                  className="input-field"
                />

                <button type="button" className="forgot-btn" onClick={() => {/* forgot password */}}>
                  Forgot password?
                </button>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Logging In...' : 'Log In'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* --- SIGN UP VIEW --- */
          <div className={`auth-wrapper ${animationClass}`}>
            {/* Left Side - Sign Up Form */}
            <div className="form-panel">
              <h1 className="form-title">SIGN UP</h1>

              {error && <div className="error-message">{error}</div>}

              <form className="auth-form" onSubmit={handleRegisterSubmit}>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={registerData.fullName}
                  onChange={handleRegisterChange}
                  required
                  className="input-field"
                />

                <div className="input-row">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    className="input-field half"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    className="input-field half"
                  />
                </div>

                <input
                  type="text"
                  name="nicPassport"
                  placeholder="NIC/Passport"
                  value={registerData.nicPassport}
                  onChange={handleRegisterChange}
                  className="input-field"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                  minLength="6"
                  className="input-field"
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  required
                  className="input-field"
                />

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </form>

              <p className="divider-text">Or</p>

              <p className="signup-with-text">SignUp with</p>

              <div className="social-login">
                <button className="social-btn">
                  <i className="fa-brands fa-facebook"></i>
                </button>
                <button className="social-btn">
                  <i className="fa-brands fa-apple"></i>
                </button>
                <button className="social-btn">
                  <i className="fa-brands fa-google"></i>
                </button>
              </div>

              <p className="toggle-link">
                Already have an Account? <span onClick={switchToLogin}>Log in</span>
              </p>
            </div>

            {/* Right Side - Welcome Panel */}
            <div className="welcome-panel welcome-panel-right">
              <img src={logo} alt="MovieNest Logo" className="logo-img" />
              <h2 className="welcome-subtitle">Welcome To</h2>
              <h1 className="brand-name">MovieNest</h1>
              <p className="welcome-text">
                Register with your personal details to use all of site features
              </p>
              <button className="switch-btn" onClick={switchToLogin}>
                Log In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;