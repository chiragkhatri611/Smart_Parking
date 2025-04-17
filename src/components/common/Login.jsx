import axios from 'axios';
import React, { useState }  from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {HomeNav }from "./HomeNav";
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';

import './styles.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [email, setemail] = useState("");
    const [isforgotpasswordCLicked, setisforgotpasswordCLicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  

    const submitHandler = async (data) => {
        setIsLoading(true);
        setError("");
        setShowError(false);
        
        try {
            const res = await axios.post("/user/login/", data);
            if (res.status === 200) {
                const token = res.data.token;
                localStorage.setItem("token", token);
                localStorage.setItem("id", res.data.user._id);
                localStorage.setItem("role", res.data.user.role.name);
                showSuccessToast("Login successful!");
                if (res.data.user.role.name === "User") navigate("/user");
                else if (res.data.user.role.name === "ParkingOwner") navigate("/parking_owner");
            }
        } catch (error) {
            console.error("Login error:", error);
            showErrorToast(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(submitHandler)();
        }
    };

    const forgotPasswordHandler = async () => {
        setIsForgotPasswordLoading(true);
        try {
            const res = await axios.post("/forgotpassword?email=" + email);
            showSuccessToast("Password reset link sent to your email!");
            setShowForgotPasswordModal(false);
        } catch (error) {
            console.error("Forgot password error:", error);
            showErrorToast(error.response?.data?.message || "Failed to send reset link");
        } finally {
            setIsForgotPasswordLoading(false);
        }
    };

    return (
        <>
        <HomeNav/>
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Login</h2>
                {showError && (
                    <div className="error-alert">
                        <i className="fas fa-exclamation-circle"></i>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit(submitHandler)} onKeyDown={handleKeyDown}>
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            {...register("email")} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="password-input-container">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                {...register("password")} 
                                required 
                            />
                            <button 
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            'Login'
                        )}
                    </button>
                    <p className="register-link">
                        Don't have an account? <Link to="/signup">Register</Link>
                    </p>
                </form>
                <div className="forgot-password-section">
                    <button
                        className="forgot-password-btn"
                        onClick={() => setShowForgotPasswordModal(true)}
                    >
                        Forgot Password?
                    </button>
                </div>
            </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotPasswordModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Reset Password</h3>
                    <div className="form-group">
                        <label>Enter Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(event) => setemail(event.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="modal-buttons">
                        <button 
                            className="close-button"
                            onClick={() => setShowForgotPasswordModal(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className="confirm-button"
                            onClick={forgotPasswordHandler}
                            disabled={isForgotPasswordLoading}
                        >
                            {isForgotPasswordLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};