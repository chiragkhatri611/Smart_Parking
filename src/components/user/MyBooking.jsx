import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import '../common/styles.css';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';
import './MyBooking.css';

export const MyBooking = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();
    const [vehicles, setVehicles] = useState([]);
    const [parkingDetails, setParkingDetails] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [reservationData, setReservationData] = useState(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        registrationNum: '',
        vehicleType: '2Wheeler'
    });
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [filteredEndTimeSlots, setFilteredEndTimeSlots] = useState([]);

    useEffect(() => {
        const parkingId = localStorage.getItem('selected_parking_id');
        if (!parkingId) {
            navigate('/available-booking');
            return;
        }

        // Fetch parking details
        const fetchParkingDetails = async () => {
            try {
                const res = await axios.get(`/parking/${parkingId}`);
                setParkingDetails(res.data);
            } catch (error) {
                console.error("Error fetching parking details:", error);
            }
        };

        // Fetch user's vehicles
        const fetchVehicles = async () => {
            try {
                const userId = localStorage.getItem('id');
                const res = await axios.get(`/vehicles/user/${userId}`);
                setVehicles(res.data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };

        fetchParkingDetails();
        fetchVehicles();
    }, [navigate]);

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            slots.push({
                value: `${hour}:00`,
                label: `${hour.toString().padStart(2, '0')}:00`
            });
        }
        setTimeSlots(slots);
    };

    useEffect(() => {
        generateTimeSlots();
    }, []);

    const handleAddVehicle = async () => {
        try {
            const userId = localStorage.getItem('id');
            const vehicleData = {
                ...newVehicle,
                user_id: userId
            };

            const res = await axios.post("/vehicle", vehicleData);
            if (res.status === 200) {
                // Refresh vehicles list
                const updatedVehicles = await axios.get(`/vehicles/user/${userId}`);
                setVehicles(updatedVehicles.data);
                setShowVehicleModal(false);
                setNewVehicle({
                    registrationNum: '',
                    vehicleType: '2Wheeler'
                });
            }
        } catch (error) {
            console.error("Error adding vehicle:", error);
            setErrorMessage(error.response?.data?.message || "Failed to add vehicle");
        }
    };

    const handleStartTimeChange = (e) => {
        const selectedStartTime = e.target.value;
        setStartTime(selectedStartTime);
        
        // Filter end time slots to only show times after start time + 1 hour
        const startHour = parseInt(selectedStartTime.split(':')[0]);
        const filteredSlots = timeSlots.filter(slot => {
            const slotHour = parseInt(slot.value.split(':')[0]);
            return slotHour > startHour;
        });
        setFilteredEndTimeSlots(filteredSlots);
        setEndTime(''); // Reset end time when start time changes
    };

    const handleEndTimeChange = (e) => {
        setEndTime(e.target.value);
    };

    const submitHandler = async (data) => {
        try {
            const userId = localStorage.getItem('id');
            const parkingId = localStorage.getItem('selected_parking_id');
            
            // Convert time strings to integers
            const startTimeInt = parseInt(data.startTime.split(':')[0]);
            const endTimeInt = parseInt(data.endTime.split(':')[0]);
            
            const bookingData = {
                ...data,
                startTime: startTimeInt,
                endTime: endTimeInt,
                user_id: userId,
                parking_id: parkingId,
                paymentStatus: 'pending'
            };

            const res = await axios.post("/reservation/auto/", bookingData);
            if (res.status === 200) {
                setReservationData(res.data);
                setShowPaymentModal(true);
            }
        } catch (error) {
            console.error("Booking error:", error);
            showErrorToast(error.response?.data?.message || "Failed to create booking");
        }
    };

    const handlePayment = async () => {
        try {
            setIsProcessingPayment(true);
            const res = await axios.put(`/reservation/payment/confirm/${reservationData.reservation_id}`);
            if (res.status === 200) {
                showSuccessToast("Payment successful!");
                setShowPaymentModal(false);
                setTimeout(() => {
                    navigate('/user/bookingHistory');
                }, 2000);
            }
        } catch (error) {
            console.error("Payment error:", error);
            showErrorToast(error.response?.data?.message || "Failed to process payment");
        } finally {
            setIsProcessingPayment(false);
        }
    };

    return (
        <div className="booking-container">
            {showSuccess && (
                <div className="success-toast">
                    <div className="success-content">
                        <span className="success-icon">✓</span>
                        <span className="success-message">Booking Created Successfully!</span>
                    </div>
                </div>
            )}
            {errorMessage && (
                <div className="error-toast">
                    <div className="error-content">
                        <span className="error-icon">✕</span>
                        <span className="error-message">{errorMessage}</span>
                    </div>
                </div>
            )}

            <div className="booking-wrapper">
                <h2 className="booking-title">Create New Booking</h2>
                
                {parkingDetails && (
                    <div className="parking-info-card" style={{marginBottom: '20px'}}>
                        <h3>{parkingDetails.title}</h3>
                        <p>{parkingDetails.address}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(submitHandler)} className="booking-form">
                    <div className="form-section">
                        <h3>Vehicle Details</h3>
                        <div className="form-row">
                            <div className="form-group" style={{marginBottom: '0px'}}>
                                <label>Select Vehicle</label>
                                <select {...register("vehicle_id")} required>
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map((vehicle) => (
                                        <option key={vehicle._id} value={vehicle._id}>
                                            {vehicle.registrationNum} - {vehicle.vehicleType}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                className="add-vehicle-btn"
                                onClick={() => setShowVehicleModal(true)}
                            >
                                Add New Vehicle
                            </button>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Booking Details</h3>
                        <div className="form-group">
                            <label>Booking Date</label>
                            <input 
                                type="date" 
                                {...register("bookingDate")} 
                                required 
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="time-slot-group">
                            <div className="form-group">
                                <label>Start Time</label>
                                <select 
                                    {...register("startTime")} 
                                    required
                                    onChange={handleStartTimeChange}
                                    value={startTime}
                                >
                                    <option value="">Select Start Time</option>
                                    {timeSlots.map((slot) => (
                                        <option key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>End Time</label>
                                <select 
                                    {...register("endTime")} 
                                    required
                                    onChange={handleEndTimeChange}
                                    value={endTime}
                                    disabled={!startTime}
                                >
                                    <option value="">Select End Time</option>
                                    {filteredEndTimeSlots.map((slot) => (
                                        <option key={slot.value} value={slot.value}>
                                            {slot.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Confirm Booking</button>
                    </div>
                </form>
            </div>

            {showVehicleModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Vehicle</h3>
                        <div className="form-group">
                            <label>Registration Number</label>
                            <input
                                type="text"
                                value={newVehicle.registrationNum}
                                onChange={(e) => setNewVehicle({...newVehicle, registrationNum: e.target.value})}
                                placeholder="Enter registration number"
                            />
                        </div>
                        <div className="form-group">
                            <label>Vehicle Type</label>
                            <div className="radio-group">
                                <div className="radio-option">
                                    <label>
                                        <input
                                            type="radio"
                                            value="2Wheeler"
                                            checked={newVehicle.vehicleType === '2Wheeler'}
                                            onChange={(e) => setNewVehicle({...newVehicle, vehicleType: e.target.value})}
                                        />
                                        2 Wheeler
                                    </label>
                                </div>
                                <div className="radio-option">
                                    <label>
                                        <input
                                            type="radio"
                                            value="4Wheeler"
                                            checked={newVehicle.vehicleType === '4Wheeler'}
                                            onChange={(e) => setNewVehicle({...newVehicle, vehicleType: e.target.value})}
                                        />
                                        4 Wheeler
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-buttons">
                            <button
                                className="close-button"
                                onClick={() => setShowVehicleModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="confirm-button"
                                onClick={handleAddVehicle}
                            >
                                Add Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showPaymentModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Payment Required</h3>
                        <div className="payment-details">
                            <p>Amount to Pay: ₹{reservationData?.amountPaid}</p>
                            <p>Slot: {reservationData?.slotName}</p>
                        </div>
                        <div className="modal-buttons">
                            <button
                                className="cancel-button"
                                onClick={() => setShowPaymentModal(false)}
                                disabled={isProcessingPayment}
                            >
                                Cancel
                            </button>
                            <button
                                className="pay-button"
                                onClick={handlePayment}
                                disabled={isProcessingPayment}
                            >
                                {isProcessingPayment ? (
                                    <span className="loading-spinner"></span>
                                ) : (
                                    'Pay Now'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
