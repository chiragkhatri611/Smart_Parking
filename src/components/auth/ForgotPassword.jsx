import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../common/styles.css';

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await axios.post('/auth/forgot-password', { email });
            setMessage(response.data.message);
            setEmail('');
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-wrapper">
                <div className="forgot-password-content">
                    <h2 className="forgot-password-title">Reset Password</h2>
                    <p className="forgot-password-subtitle">
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-group">
                                <i className="fas fa-envelope"></i>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {message && (
                            <div className="success-message">
                                <i className="fas fa-check-circle"></i>
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i>
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            className="reset-password-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>

                        <div className="back-to-login">
                            <Link to="/login">
                                <i className="fas fa-arrow-left"></i>
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; 