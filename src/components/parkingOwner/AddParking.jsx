import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../common/styles.css';

export const AddParking = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLocationSuccess, setShowLocationSuccess] = useState(false);
  const [showLocationError, setShowLocationError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showParkingError, setShowParkingError] = useState(false);
  const [parkingErrorMessage, setParkingErrorMessage] = useState('');

  const submitHandler = async (data) => {
    try {
      const userId = localStorage.getItem('id');
      data.user_id = userId;
      data.active = true;
      // data.active = data.active === "true" ? true : false;
      data.lat = "0";
      data.log = "0";
      console.log(data);
      const res = await axios.post("/parking", data);
      if (res.status === 200) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          // navigate("/owner/my-parking");
        }, 2000);
      }
    } catch (error) {
      console.error("Add parking error:", error);
      setParkingErrorMessage(error.response?.data?.message || "Failed to add parking");
      setShowParkingError(true);
      setTimeout(() => {
        setShowParkingError(false);
      }, 2000);
    }
  };

  const getAllLocations = async () => {
    try {
      const res = await axios.get("/locations");
      setLocations(res.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleAddLocation = async () => {
    if (locationName.trim()) {
      try {
        const res = await axios.post("/location", { locationName: locationName });
        if (res.status === 200) {
          setLocationName('');
          setShowModal(false);
          setShowLocationSuccess(true);
          getAllLocations();
          setTimeout(() => {
            setShowLocationSuccess(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Error adding location:", error);
        setErrorMessage(error.response?.data?.message || "Failed to add location");
        setShowLocationError(true);
        setTimeout(() => {
          setShowLocationError(false);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    getAllLocations();
  }, []);

  return (
    <div className="add-parking-container">
      {showSuccess && (
        <div className="success-toast">
          <div className="success-content">
            <span className="success-icon">✓</span>
            <span className="success-message">Parking Added Successfully!</span>
          </div>
        </div>
      )}
      {showLocationSuccess && (
        <div className="success-toast">
          <div className="success-content">
            <span className="success-icon">✓</span>
            <span className="success-message">Location Added Successfully!</span>
          </div>
        </div>
      )}
      {showLocationError && (
        <div className="error-toast">
          <div className="error-content">
            <span className="error-icon">✕</span>
            <span className="error-message">{errorMessage}</span>
          </div>
        </div>
      )}
      {showParkingError && (
        <div className="error-toast">
          <div className="error-content">
            <span className="error-icon">✕</span>
            <span className="error-message">{parkingErrorMessage}</span>
          </div>
        </div>
      )}
      
      <div className="add-parking-wrapper">
        <h2 className="add-parking-title">Add New Parking</h2>
        <form onSubmit={handleSubmit(submitHandler)} className="add-parking-form">
          <div className="form-section">
            <h3>Location Details</h3>
            <div className="form-row">
              <div className="form-group-add-loc">
            <label>Select Location</label>
            <select {...register("location_id")} required>
              <option value="">Select Location</option>
              {locations.map((location) => (
                <option key={location._id} value={location._id}>
                  {location.locationName}
                </option>
              ))}
            </select>
              </div>
              <button 
                type="button" 
                className="add-location-btn"
                onClick={() => setShowModal(true)}
              >
                Add New Location
              </button>
            </div>
          </div>

          <div className="form-section">
            <h3>Parking Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  {...register("title")} 
                  required 
                  placeholder="Enter parking title"
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input 
                  type="text" 
                  {...register("address")} 
                  required 
                  placeholder="Enter parking address"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Other Information</label>
              <input 
                type="text" 
                {...register("otherInformation")} 
                required 
                placeholder="Enter additional information"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Capacity Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Two Wheeler Capacity</label>
                <input 
                  type="number" 
                  {...register("totalCapacityTwoWheeler")} 
                  required 
                  placeholder="Enter capacity"
                />
              </div>
              <div className="form-group">
                <label>Four Wheeler Capacity</label>
                <input 
                  type="number" 
                  {...register("totalCapacityFourWheeler")} 
                  required 
                  placeholder="Enter capacity"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Two Wheeler Hourly Rate</label>
                <input 
                  type="number" 
                  {...register("hourlyChargeTwoWheeler")} 
                  required 
                  placeholder="Enter hourly rate"
                />
              </div>
              <div className="form-group">
                <label>Four Wheeler Hourly Rate</label>
                <input 
                  type="number" 
                  {...register("hourlyChargeFourWheeler")} 
                  required 
                  placeholder="Enter hourly rate"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Parking Type</label>
              <div className="radio-group">
                <div className="radio-option">
                <label htmlFor="road"><input 
                    type="radio" 
                    id="road" 
                    value="Road" 
                    {...register("parkingType")} 
                    required 
                    defaultChecked
                  />
                  Road
                  </label>
                </div>
                <div className="radio-option">
                  <label htmlFor="ground">
                    <input 
                    type="radio" 
                    id="ground" 
                    value="Ground" 
                    {...register("parkingType")} 
                    required 
                  />
                  Ground
                  </label>
                </div>
                <div className="radio-option">
                <label htmlFor="building">
                  <input 
                    type="radio" 
                    id="building" 
                    value="Building" 
                    {...register("parkingType")} 
                    required 
                  />
                  Building</label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Add Parking</button>
          </div>
        </form>
      </div>

      {/* Location Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Location</h3>
            <div className="form-group">
              <label>Location Name</label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Enter location name"
              />
            </div>
            <div className="modal-buttons">
              <button 
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button 
                className="confirm-button"
                onClick={handleAddLocation}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};