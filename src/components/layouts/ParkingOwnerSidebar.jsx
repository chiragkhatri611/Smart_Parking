import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "../common/styles.css";
import {HomeNav} from "../common/HomeNav";

export const ParkingOwnerSidebar = () => {
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
          <h2>Parking Owner</h2>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {/* <li>
              <Link to="/parking_owner/dashboard" className="nav-link">
                <i className="bi bi-speedometer2"></i>
                <span>Dashboard</span>
              </Link>
            </li> */}
            <li>
              <Link to="/parking_owner/addParking" className="nav-link">
                <i className="bi bi-plus-circle"></i>
                <span>Add Parking</span>
              </Link>
            </li>
            <li>
              <Link to="/parking_owner/myParking" className="nav-link">
                <i className="bi bi-p-square"></i>
                <span>My Parking</span>
              </Link>
            </li>
            <li>
              <Link to="/parking_owner/allBookings" className="nav-link">
                <i className="bi bi-calendar-check"></i>
                <span>All Bookings</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/owner/revenue" className="nav-link">
                <i className="bi bi-graph-up"></i>
                <span>Revenue</span>
              </Link>
            </li> */}
            <li>
              <Link to="/parking_owner/profile" className="nav-link">
                <i className="bi bi-person"></i>
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/parking_owner/settings" className="nav-link">
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
