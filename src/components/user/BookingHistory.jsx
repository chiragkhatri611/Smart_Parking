import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';
import { CustomLoader } from '../CustomLoader';
import './BookingHistory.css';

export const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getBookingHistory = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem('id');
      console.log(userId);
      const res = await axios.get(`/reservations/user/${userId}`);
      if (res.data) {
        setBookings(res.data);
      }
    } catch (error) {
      console.error("Error fetching booking history:", error);
      showErrorToast("Failed to fetch booking history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBookingHistory();
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
    <div className="booking-history-container">
      {isLoading && <CustomLoader />}
      
      <h1 className="page-title">Booking History</h1>
      
      {bookings.length === 0 ? (
        <div className="no-data-message">
          No booking history found.
        </div>
      ) : (
        <div className="booking-table-container">
          <table className="booking-table">
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
