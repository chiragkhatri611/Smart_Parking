import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import '../common/styles.css';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig'; // Import toast utilities

export const AddParking = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [locations, setLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationSearch, setLocationSearch] = useState('');

  // Watch capacity fields for validation
  const twoWheelerCapacity = watch("totalCapacityTwoWheeler");
  const fourWheelerCapacity = watch("totalCapacityFourWheeler");

  const submitHandler = async (data) => {
    // Validate at least one capacity is greater than 0
    if (parseInt(data.totalCapacityTwoWheeler) === 0 && parseInt(data.totalCapacityFourWheeler) === 0) {
      showErrorToast("At least one capacity must be greater than 0");
      return;
    }

    try {
      const userId = localStorage.getItem('id');
      data.user_id = userId;
      data.active = true;
      data.lat = "0";
      data.log = "0";
      const res = await axios.post("/parking", data);
      if (res.status === 200) {
        showSuccessToast("Parking Added Successfully!");
      }
    } catch (error) {
      console.error("Add parking error:", error);
      showErrorToast(error.response?.data?.message || "Failed to add parking");
    }
  };

  const getAllLocations = async () => {
    try {
      const res = await axios.get("/locations");
      setLocations(res.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      showErrorToast("Failed to fetch locations");
    }
  };

  const handleAddLocation = async () => {
    if (locationName.trim()) {
      try {
        const res = await axios.post("/location", { locationName });
        if (res.status === 200) {
          setLocationName('');
          setShowModal(false);
          showSuccessToast("Location Added Successfully!");
          getAllLocations();
        }
      } catch (error) {
        console.error("Error adding location:", error);
        showErrorToast(error.response?.data?.message || "Failed to add location");
      }
    } else {
      showErrorToast("Location name cannot be empty");
    }
  };

  useEffect(() => {
    getAllLocations();
  }, []);

  // Filtered locations based on search
  const filteredLocations = locations.filter(location =>
    location.locationName.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <div className="add-parking-container">
      <div className="add-parking-wrapper">
        <h2 className="add-parking-title">Add New Parking</h2>
        <form onSubmit={handleSubmit(submitHandler)} className="add-parking-form">
          <div className="form-section">
            <h3>Location Details</h3>
            <div className="form-row">
              <div className="form-group-add-loc">
                <select
                  {...register("location_id", { required: "Location is required" })}
                  onChange={(e) => setValue("location_id", e.target.value)}
                >
                  <option value="">Select Location</option>
                  {filteredLocations.map((location) => (
                    <option key={location._id} value={location._id}>
                      {location.locationName}
                    </option>
                  ))}
                </select>
                {errors.location_id && (
                  <span className="error-message">{errors.location_id.message}</span>
                )}
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
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter parking title"
                />
                {errors.title && (
                  <span className="error-message">{errors.title.message}</span>
                )}
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  {...register("address", { required: "Address is required" })}
                  placeholder="Enter parking address"
                />
                {errors.address && (
                  <span className="error-message">{errors.address.message}</span>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Other Information</label>
              <input
                type="text"
                {...register("otherInformation", {
                  required: "Other information is required",
                })}
                placeholder="Enter additional information"
              />
              {errors.otherInformation && (
                <span className="error-message">{errors.otherInformation.message}</span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Capacity Details</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Two Wheeler Capacity</label>
                <input
                  type="number"
                  {...register("totalCapacityTwoWheeler", {
                    required: "Two wheeler capacity is required",
                    min: { value: 0, message: "Capacity cannot be negative" },
                    max: { value: 25, message: "Capacity cannot exceed 25" },
                    valueAsNumber: true,
                  })}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(25, parseInt(e.target.value) || 0));
                    setValue("totalCapacityTwoWheeler", value);
                  }}
                  placeholder="Enter capacity"
                />
                {errors.totalCapacityTwoWheeler && (
                  <span className="error-message">
                    {errors.totalCapacityTwoWheeler.message}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>Four Wheeler Capacity</label>
                <input
                  type="number"
                  {...register("totalCapacityFourWheeler", {
                    required: "Four wheeler capacity is required",
                    min: { value: 0, message: "Capacity cannot be negative" },
                    max: { value: 25, message: "Capacity cannot exceed 25" },
                    valueAsNumber: true,
                  })}
                  onChange={(e) => {
                    const value = Math.max(0, Math.min(25, parseInt(e.target.value) || 0));
                    setValue("totalCapacityFourWheeler", value);
                  }}
                  placeholder="Enter capacity"
                />
                {errors.totalCapacityFourWheeler && (
                  <span className="error-message">
                    {errors.totalCapacityFourWheeler.message}
                  </span>
                )}
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
                  {...register("hourlyChargeTwoWheeler", {
                    required: "Two wheeler rate is required",
                    min: { value: 0, message: "Rate cannot be negative" },
                    valueAsNumber: true,
                  })}
                  onChange={(e) => {
                    const value = Math.max(0, parseFloat(e.target.value) || 0);
                    setValue("hourlyChargeTwoWheeler", value);
                  }}
                  placeholder="Enter hourly rate"
                />
                {errors.hourlyChargeTwoWheeler && (
                  <span className="error-message">
                    {errors.hourlyChargeTwoWheeler.message}
                  </span>
                )}
              </div>
              <div className="form-group">
                <label>Four Wheeler Hourly Rate</label>
                <input
                  type="number"
                  {...register("hourlyChargeFourWheeler", {
                    required: "Four wheeler rate is required",
                    min: { value: 0, message: "Rate cannot be negative" },
                    valueAsNumber: true,
                  })}
                  onChange={(e) => {
                    const value = Math.max(0, parseFloat(e.target.value) || 0);
                    setValue("hourlyChargeFourWheeler", value);
                  }}
                  placeholder="Enter hourly rate"
                />
                {errors.hourlyChargeFourWheeler && (
                  <span className="error-message">
                    {errors.hourlyChargeFourWheeler.message}
                  </span>
                )}
              </div>
            </div>
            <div className="form-group">
              <label>Parking Type</label>
              <div className="radio-group">
                <div className="radio-option">
                  <label htmlFor="road">
                    <input
                      type="radio"
                      id="road"
                      value="Road"
                      {...register("parkingType", {
                        required: "Parking type is required",
                      })}
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
                    />
                    Building
                  </label>
                </div>
              </div>
              {errors.parkingType && (
                <span className="error-message">{errors.parkingType.message}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Add Parking</button>
          </div>
        </form>
      </div>

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