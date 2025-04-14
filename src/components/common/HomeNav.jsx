import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import './Home.css'

export const HomeNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const token = localStorage.getItem('token');
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-logo">
            <span className="brand-text">Smart</span>Parking
          </Link>
        </div>
        {token ? (
          <div className="nav-links">
          <Link to="/login" className="nav-link">Profile</Link>
          {/* <Link to="/signup" className="nav-link btn-signup">Sign Up2</Link> */}
        </div>
        ) : (
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/login" 
            className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className="nav-link btn-signup"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </Link>
          </div>
        )}

        <div className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  )
};
