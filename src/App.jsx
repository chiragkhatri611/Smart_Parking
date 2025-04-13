import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { UserSidebar } from "./components/layouts/UserSidebar";
import { UserNavbar } from "./components/layouts/UserNavbar";
import { Error404 } from "./components/common/Error404";
import { Route, Routes } from "react-router-dom";
import { UserDashboard } from "./components/user/UserDashboard";
import { UserProfile } from "./components/user/UserProfile";
import { AddProduct } from "./components/vendor/AddProduct";
import { VenderSidebar } from "./components/vendor/VendorSidebar";
import { Signup } from "./components/common/Signup";
import { ResetPassword } from "./components/common/ResetPassword";

import axios from "axios";
import { Login } from "./components/common/Login";
import { Home } from "./components/common/Home";
import  {ParkingOwnerSidebar } from "./components/layouts/ParkingOwnerSidebar";
import { ParkingOwnerDashboard } from "./components/parkingOwner/ParkingOwnerDashboard";
import { AddParking } from "./components/parkingOwner/AddParking"; 
import { MyParking } from "./components/parkingOwner/MyParking";
import { AddVehicle } from "./components/user/AddVehicle";
import { AvailableBooking } from "./components/user/AvailableBooking";


function App() {

  axios.defaults.baseURL = "http://localhost:8000";


  return (
    <>
    {/* <div className="layout-fixed sidebar-expand-lg bg-body-tertiary sidebar-open app-loaded"> */}
      <div>
        <Routes>
        <Route path ="/" element = {<Home/>}></Route>
          <Route path="/signup" element = {<Signup/>}></Route>
          <Route path="/login" element = {<Login/>}></Route>
          <Route path="/resetpassword/:token" element = {<ResetPassword/>}></Route>
          <Route path="/user" element={<UserSidebar />}>
            <Route path="dashboard" element={<UserDashboard />}></Route>
            <Route path="profile" element={<UserProfile />}></Route>
            <Route path="addVehicle" element={<AddVehicle />}></Route>
            <Route path="availableBooking" element={<AvailableBooking />}></Route>
            
          </Route>

          <Route path="/parking_owner" element={<ParkingOwnerSidebar />}>
            <Route path="dashboard" element={<ParkingOwnerDashboard />}></Route>
            <Route path="addParking" element={<AddParking />}></Route>
            <Route path="myParking" element={<MyParking />}></Route>
          </Route>

          {/* <Route path="/vendor" element={<VenderSidebar />}>
            <Route path="addproduct" element={<AddProduct />}></Route>
          </Route> */}
        <Route path="/*" element ={<Error404/>}></Route>
        </Routes>
      </div>
    {/* </div> */}
    </>
  );
}

export default App;
