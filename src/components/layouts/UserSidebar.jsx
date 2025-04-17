import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "../common/styles.css";
import {HomeNav} from "../common/HomeNav";

export const UserSidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  const handleLogout = () => {
    localStorage.clear(); // Clears token and user info
    navigate("/login");
  };

  return (
    <>
    {/* <HomeNav></HomeNav> */}
    <div className="sidebar-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Smart Parking</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {/* <li>
              <Link to="/user/dashboard" className="nav-link">
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/user/addVehicle" className="nav-link">
                <i className="bi bi-car-front"></i>
                <span>Add Vehicle</span>
              </Link>
            </li> */}
            <li>
              <Link to="/user/availableBooking" className="nav-link">
                <i className="bi bi-calendar3"></i>
                <span>Available Booking</span>
              </Link>
            </li>
            <li>
              <Link to="/user/bookingHistory" className="nav-link">
                <i className="bi bi-calendar-check"></i>
                <span>My Bookings</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/user/bookingHistory" className="nav-link">
                <i className="bi bi-credit-card"></i>
                <span>Booking History</span>
              </Link>
            </li> */}
            <li>
              <Link to="/user/profile" className="nav-link">
                <i className="bi bi-person"></i>
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/user/settings" className="nav-link">
                <i className="bi bi-gear"></i>
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <Link onClick={handleLogout} className="logout-link">
            <i className="bi bi-box-arrow-right"></i>
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
    </>
  );
};

