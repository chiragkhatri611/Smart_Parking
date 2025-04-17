import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { HomeNav } from "./HomeNav";
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';
import './styles.css';
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [roles, setRoles] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async (data) => {
    setIsLoading(true);
    try {
      data.securityAmount = 0;
      data.status = "true";
      data.status = data.status === "true" ? true : false;
      
      const res = await axios.post("/user", data);
      if (res.status === 201) {
        showSuccessToast("Signup successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Signup error:", error);
      showErrorToast(error.response?.data?.message || "Signup failed. Please try again.");
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

  const getAllRoles = async () => {
    try {
      const res = await axios.get("/roles");
      setRoles(res.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  return (
    <>
    <HomeNav></HomeNav>
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="login-title">Signup</h2>
        <form onSubmit={handleSubmit(submitHandler)} onKeyDown={handleKeyDown}>
          <div className="form-group">
            <label>First Name</label>
            <input 
              type="text" 
              {...register("firstName")} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input 
              type="text" 
              {...register("lastName")} 
              required 
            />
          </div>
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
          <div className="form-group">
            <label>Select Role</label>
            <select {...register("role_id")} required>
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Signup'
            )}
          </button>
          <p className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};