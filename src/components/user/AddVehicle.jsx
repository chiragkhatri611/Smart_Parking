import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../common/styles.css';

export const AddVehicle = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showVehicleError, setShowVehicleError] = useState(false);
  const [vehicleErrorMessage, setVehicleErrorMessage] = useState('');

  const submitHandler = async (data) => {
    try {
      const userId = localStorage.getItem('id');
      data.user_id = userId;
      console.log(data);
      const res = await axios.post("/vehicle", data);
      if (res.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          // navigate("/owner/my-vehicle");
        }, 2000);
      }
    } catch (error) {
      console.error("Add vehicle error:", error);
      setVehicleErrorMessage(error.response?.data?.message || "Failed to add vehicle");
      setShowVehicleError(true);
      setTimeout(() => {
        setShowVehicleError(false);
      }, 2000);
    }
  };


  return (
    <div className="add-vehicle-container">
      {showSuccess && (
        <div className="success-toast">
          <div className="success-content">
            <span className="success-icon">✓</span>
            <span className="success-message">Vehicle Added Successfully!</span>
          </div>
        </div>
      )}
      {showVehicleError && (
        <div className="error-toast">
          <div className="error-content">
            <span className="error-icon">✕</span>
            <span className="error-message">{vehicleErrorMessage}</span>
          </div>
        </div>
      )}
      
      <div className="add-vehicle-wrapper">
        <h2 className="add-vehicle-title">Add New Vehicle</h2>
        <form onSubmit={handleSubmit(submitHandler)} className="add-vehicle-form">
        
            <div className="form-group">
                <label>Title</label>
                <input 
                  type="Registration Number" 
                  {...register("registrationNum")} 
                  required 
                  placeholder="Enter vehicle Registration Number"
                />
            </div>
            
            <div className="form-group">
              <label>Vehicle Type</label>
              <div className="radio-group">
                <div className="radio-option">
                <label htmlFor="2wheeler"><input 
                    type="radio" 
                    id="2wheeler" 
                    value="2Wheeler" 
                    {...register("vehicleType")} 
                    required 
                    defaultChecked
                  />
                  2 Wheeler
                  </label>
                </div>
                <div className="radio-option">
                  <label htmlFor="2wheeler">
                    <input 
                    type="radio" 
                    id="2wheeler" 
                    value="4Wheeler" 
                    {...register("vehicleType")} 
                    required 
                  />
                  4 Wheeler
                  </label>
                </div>
              </div>
            </div> 


          <div className="form-actions">
            <button type="submit" className="submit-btn">Add Vehicle</button>
          </div>
        </form>
      </div>

    </div>
  );
};