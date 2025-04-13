import axios from "axios";
import React, { useEffect, useState } from "react";
import { CustomLoader } from "../CustomLoader";
import { Bounce, toast, ToastContainer } from "react-toastify";
import '../common/styles.css';

export const MyParking = () => {
  const [parkings, setParkings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user_id = localStorage.getItem('id');

  const getParkingList = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/parking/user/${user_id}`);
      if (res.data) {
        setParkings(res.data); // The data is already an array, no need for res.data.data
      }
    } catch (error) {
      console.error("Error fetching parking list:", error);
      toast.error('Failed to fetch parking list', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user_id) {
      getParkingList();
    }
  }, [user_id]);

  const deleteParking = async (id) => {
    try {
      const res = await axios.delete(`/parking/${id}`);
      if (res.status === 200) {
        toast.success('Parking deleted successfully!', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        getParkingList();
      }
    } catch (error) {
      console.error("Error deleting parking:", error);
      toast.error('Failed to delete parking', {
        position: "top-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="parking-list-container">
      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      
      {isLoading && <CustomLoader />}
      
      <h1 className="page-title">My Parking List</h1>
      
      {parkings.length === 0 ? (
        <div className="no-data-message">
          No parking locations found. Add your first parking location!
        </div>
      ) : (
        <div className="parking-table-container">
          <table className="parking-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Address</th>
                <th>Type</th>
                <th>Two Wheeler</th>
                <th>Four Wheeler</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {parkings.map((parking) => (
                <tr key={parking._id}>
                  <td>
                    <div className="parking-title">{parking.title}</div>
                    <div className="parking-info">{parking.otherInformation}</div>
                  </td>
                  <td>{parking.address}</td>
                  <td>
                    <span className={`type-badge ${parking.parkingType.toLowerCase()}`}>
                      {parking.parkingType}
                    </span>
                  </td>
                  <td>
                    <div className="capacity-info">
                      <div>Capacity: {parking.totalCapacityTwoWheeler}</div>
                      <div>Rate: ₹{parking.hourlyChargeTwoWheeler}/hr</div>
                    </div>
                  </td>
                  <td>
                    <div className="capacity-info">
                      <div>Capacity: {parking.totalCapacityFourWheeler}</div>
                      <div>Rate: ₹{parking.hourlyChargeFourWheeler}/hr</div>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${parking.active ? 'active' : 'inactive'}`}>
                      {parking.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => deleteParking(parking._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
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