import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDashboard.css';
import { showErrorToast } from '../utils/toastConfig';

export const UserDashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        activeBookings: 0,
        totalVehicles: 0,
        recentBookings: []
    });
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('id');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch total bookings
                const bookingsRes = await axios.get(`/bookings/user/${userId}`);
                const activeBookingsRes = await axios.get(`/bookings/user/${userId}/active`);
                const vehiclesRes = await axios.get(`/vehicles/user/${userId}`);
                const recentBookingsRes = await axios.get(`/bookings/user/${userId}/recent`);

                setDashboardData({
                    totalBookings: bookingsRes.data.length || 0,
                    activeBookings: activeBookingsRes.data.length || 0,
                    totalVehicles: vehiclesRes.data.length || 0,
                    recentBookings: recentBookingsRes.data || []
                });
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                showErrorToast('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [userId]);

    if (loading) {
        return <div className="dashboard-loading">Loading...</div>;
    }

    return (
        <div className="user-dashboard">
            <h1>Welcome to Your Dashboard</h1>
            
            <div className="dashboard-stats">
                <div className="stat-card">
                    <i className="bi bi-calendar-check"></i>
                    <div className="stat-content">
                        <h3>Total Bookings</h3>
                        <p>{dashboardData.totalBookings}</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <i className="bi bi-calendar-event"></i>
                    <div className="stat-content">
                        <h3>Active Bookings</h3>
                        <p>{dashboardData.activeBookings}</p>
                    </div>
                </div>
                
                <div className="stat-card">
                    <i className="bi bi-car-front"></i>
                    <div className="stat-content">
                        <h3>Your Vehicles</h3>
                        <p>{dashboardData.totalVehicles}</p>
                    </div>
                </div>
            </div>

            <div className="recent-activity">
                <h2>Recent Bookings</h2>
                {dashboardData.recentBookings.length > 0 ? (
                    <div className="recent-bookings-list">
                        {dashboardData.recentBookings.map((booking) => (
                            <div key={booking._id} className="booking-card">
                                <div className="booking-info">
                                    <h4>{booking.parkingSpot?.name || 'Parking Spot'}</h4>
                                    <p>
                                        <i className="bi bi-clock"></i>
                                        {new Date(booking.startTime).toLocaleDateString()} - 
                                        {new Date(booking.endTime).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <i className="bi bi-tag"></i>
                                        Status: {booking.status}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-bookings">No recent bookings found</p>
                )}
            </div>
        </div>
    );
};
