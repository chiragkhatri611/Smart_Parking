import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css'

export const Error404 = () => {
  return (
    <div className="error-404-container">
      <div className="error-404-content">
        <h1 className="error-404-title">404</h1>
        <h2 className="error-404-subtitle">Oops! Page Not Found</h2>
        <p className="error-404-text">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="error-404-button">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};
