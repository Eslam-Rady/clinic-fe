import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import { AdminContext } from './context/AdminContext';
import { DoctorContext } from './context/DoctorContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SidebarDoctor from './components/SidebarDoctor';

import Login from './pages/login';
import Dashboard from './pages/Admin/Dashboard';
import Departments from './pages/Admin/Departments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorList';
import Users from './pages/Admin/Users';

import Appointments from './pages/Admin/Appointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorEditProfile from './pages/Doctor/DoctorEditProfile';


const App = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const homePath = aToken ? "/admin-dashboard" : "/doctor-dashboard";

  return (
    <>
      <ToastContainer />

      {aToken || dToken ? (
        <div className='bg-[#F8F9FD]'>
          <Navbar />
          <div className='flex items-start'>
            {aToken && <Sidebar />}
            {dToken && <SidebarDoctor />}

            <Routes>
              <Route path='/' element={<Navigate to={homePath} />} />

              
              {aToken && (
                <>
                  <Route path='/admin-dashboard' element={<Dashboard />} />
                  <Route path='/users' element={<Users />} />
                  <Route path='/depart' element={<Departments />} />
                  <Route path='/add-doctor' element={<AddDoctor />} />
                  <Route path='/doctors' element={<DoctorsList />} />
                  
                  <Route path='/appointments' element={<Appointments />} />
                </>
              )}

              
              {dToken && (
                <>
                  <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                  <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                  <Route path='/doctor-profile' element={<DoctorEditProfile />} />
                </>
              )}

              
              <Route path='/login' element={<Navigate to={homePath} />} />
              <Route path='*' element={<Navigate to={homePath} />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
};

export default App;
