import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { HomeNav } from "./HomeNav";
import './styles.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const token = useParams().token;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password");

  const submitHandler = async(data) => {
    setIsLoading(true);
    setError("");
    
    try {
      const obj = {
        password: data.password,
        token: token
      };
      console.log(obj)
      const res = await axios.post("/resetpassword", obj);
      console.log(res.data);
      if (res.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password. Please try again.");
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

  return (
    <>
      <HomeNav />
      <div className="reset-password-container">
        <div className="reset-password-box">
          <h2 className="reset-title">Reset Password</h2>
          {error && (
            <div className="error-alert">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          {success ? (
            <div className="success-message">
              <i className="fas fa-check-circle"></i>
              <p>Password reset successful! Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(submitHandler)} className="reset-form" onKeyDown={handleKeyDown}>
              <div className="form-group">
                <label>New Password</label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      }
                    })}
                    placeholder="Enter your new password"
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-text">{errors.password.message}</span>
                )}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="password-input-container">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: value => value === password || "Passwords do not match"
                    })}
                    placeholder="Confirm your new password"
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-text">{errors.confirmPassword.message}</span>
                )}
              </div>
              <button 
                type="submit" 
                className="reset-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};