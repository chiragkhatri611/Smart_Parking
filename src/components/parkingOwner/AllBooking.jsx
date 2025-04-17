import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';
import { CustomLoader } from '../CustomLoader';
import './AllBooking.css';

export const AllBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getParkingBookings = async () => {
    try {
      setIsLoading(true);
      const parkingId = localStorage.getItem('selected_parking_id');
      console.log(parkingId);
      const res = await axios.get(`/reservations/parking/${parkingId}`);
      if (res.data) {
        setBookings(res.data);
      }
    } catch (error) {
      console.error("Error fetching parking bookings:", error);
      showErrorToast("Failed to fetch parking bookings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getParkingBookings();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (hour) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-badge completed';
      case 'pending':
        return 'status-badge pending';
      case 'cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
    }
  };

  return (
    <div className="all-bookings-container">
      {isLoading && <CustomLoader />}
      
      <h1 className="page-title">All Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="no-data-message">
          No bookings found for this parking.
        </div>
      ) : (
        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking Date</th>
                <th>Time Slot</th>
                <th>Amount</th>
                <th>Security Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{formatDate(booking.bookingDate)}</td>
                  <td>
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </td>
                  <td>₹{booking.amountPaid}</td>
                  <td>₹{booking.securityAmountPaid}</td>
                  <td>
                    <span className={getStatusBadgeClass(booking.paymentStatus)}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
