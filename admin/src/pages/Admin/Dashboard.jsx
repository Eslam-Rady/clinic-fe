import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [doctorCount, setDoctorCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);

  const backendUrl = 'https://medical-be-u2v7.onrender.com/api/v1';
  const aToken = localStorage.getItem('aToken');

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [doctorRes, userRes, appointRes, deptRes] = await Promise.all([
          axios.get(`${backendUrl}/doctors`),
          axios.get(`${backendUrl}/users`, {
            headers: { Authorization: `Bearer ${aToken}` },
          }),
          axios.get(`${backendUrl}/appointments`, {
            headers: { Authorization: `Bearer ${aToken}` },
          }),
          axios.get(`${backendUrl}/departments`, {
            headers: { Authorization: `Bearer ${aToken}` },
          }),
        ]);

        setDoctorCount(doctorRes.data?.data?.doctors?.length || 0);
        setUserCount(userRes.data?.data?.users?.length || 0);
        setAppointmentCount(appointRes.data?.data?.appointments?.length || 0);
        setDepartmentCount(deptRes.data?.data?.departments?.length || 0);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchCounts();
  }, [aToken]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div
          onClick={() => navigate('/doctors')}
          className="bg-blue-100 p-6 rounded-lg shadow text-center cursor-pointer hover:bg-blue-200 transition"
        >
          <p className="text-3xl mb-2">🩺</p>
          <p className="text-3xl font-bold">{doctorCount}</p>
          <p className="text-gray-700 mt-1">Show All Doctors</p>
        </div>

        
        <div
          onClick={() => navigate('/users')}
          className="bg-green-100 p-6 rounded-lg shadow text-center cursor-pointer hover:bg-green-200 transition"
        >
          <p className="text-3xl mb-2">👥</p>
          <p className="text-3xl font-bold">{userCount}</p>
          <p className="text-gray-700 mt-1">Show All Users</p>
        </div>

        
        <div
          onClick={() => navigate('/appointments')}
          className="bg-yellow-100 p-6 rounded-lg shadow text-center cursor-pointer hover:bg-yellow-200 transition"
        >
          <p className="text-3xl mb-2">📅</p>
          <p className="text-3xl font-bold">{appointmentCount}</p>
          <p className="text-gray-700 mt-1">Appointments</p>
        </div>

        
        <div
          onClick={() => navigate('/departments')}
          className="bg-purple-100 p-6 rounded-lg shadow text-center cursor-pointer hover:bg-purple-200 transition"
        >
          <p className="text-3xl mb-2">🏥</p>
          <p className="text-3xl font-bold">{departmentCount}</p>
          <p className="text-gray-700 mt-1">Departments</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
