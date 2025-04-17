import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../common/styles.css';

export const AvailableBooking = () => {
    const { register, handleSubmit } = useForm();
    const [locations, setLocations] = useState([]);
    const [parkings, setparkings] = useState([]);
    const navigate = useNavigate();
    
    const getAllLocations = async () => {
        try {
          const res = await axios.get("/locations");
          setLocations(res.data);
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
    };
    
    const getParkingByLocationId = async(location_id) => {
        const res = await axios.get("/parking/location/"+location_id)
        console.log(res.data)
        setparkings(res.data)
    }

    useEffect(() => {
        getAllLocations();
    }, []);

    const handleBookNow = (parkingId) => {
        localStorage.setItem('selected_parking_id', parkingId);
        navigate('/user/myBooking');
    };

    return (
        <div className="available-booking-container">
            <div className="available-booking-wrapper">
                <h2 className="available-booking-title">Available Parking Spots</h2>
                
                <div className="location-selector">
                    <div className="form-group-add-loc">
                        <label>Select Location</label>
                        <select 
                            {...register("location_id")} 
                            onChange={(event) => {getParkingByLocationId(event.target.value)}}
                            required
                        >
                            <option value="">Select Location</option>
                            {locations.map((location) => (
                                <option key={location._id} value={location._id}>
                                    {location.locationName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="parking-grid">
                    {parkings.map((parking) => (
                        <div key={parking._id} className="parking-card">
                            <div className="parking-card-header">
                                <h3 className="parking-title">{parking.title}</h3>
                                <span className={`type-badge ${parking.parkingType.toLowerCase()}`}>
                                    {parking.parkingType}
                                </span>
                                {/* <span className={`status-badge ${parking.active ? 'active' : 'inactive'}`}>
                                    {parking.active ? 'Active' : 'Inactive'}
                                </span> */}
                            </div>
                            
                            <div className="parking-info">
                                <p className="parking-address">
                                    <i className="fas fa-map-marker-alt"></i>
                                    {parking.address}
                                </p>
                                <p className="parking-details">{parking.otherInformation}</p>
                            </div>
{/* 
                            <div className="parking-type">
                                <span className={`type-badge ${parking.parkingType.toLowerCase()}`}>
                                    {parking.parkingType}
                                </span>
                            </div> */}

                            <div className="parking-capacities">
                                <div className="capacity-section">
                                    <h4>Two Wheeler</h4>
                                    <div className="capacity-details">
                                        <span>Capacity: {parking.totalCapacityTwoWheeler}</span>
                                        <span>Rate: ₹{parking.hourlyChargeTwoWheeler}/hr</span>
                                    </div>
                                </div>
                                
                                <div className="capacity-section">
                                    <h4>Four Wheeler</h4>
                                    <div className="capacity-details">
                                        <span>Capacity: {parking.totalCapacityFourWheeler}</span>
                                        <span>Rate: ₹{parking.hourlyChargeFourWheeler}/hr</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className="book-now-btn"
                                onClick={() => handleBookNow(parking._id)}
                            >
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
