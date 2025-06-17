import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { DoctorContext } from '../../context/DoctorContext';

const DoctorAppointments = () => {
  const { dToken } = useContext(DoctorContext);
  const doctorId = localStorage.getItem('doctorId');
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`https://medical-be-u2v7.onrender.com/api/v1/appointments/doctor/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${dToken}`,
        },
      });
      setAppointments(res.data?.data?.appointments || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (dToken && doctorId) fetchAppointments();
  }, [dToken]);

  return (
    <div className="w-full flex justify-center px-4">
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-10 border-b pb-3 border-blue-200">
          My Appointments
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {appointments.map((apt, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white shadow-lg border border-gray-100 p-6 flex flex-col gap-3 hover:shadow-xl transition duration-300"
            >
              <div>
                <p className="text-sm text-gray-500">Patient</p>
                <p className="text-lg font-semibold text-gray-800">{apt.user?.name || 'Unknown'}</p>
              </div>

              <div className="flex justify-between text-sm text-gray-700 pt-2">
                <div>
                  <p className="text-xs font-semibold text-gray-400">Date</p>
                  <p>{apt.date}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400">Time</p>
                  <p>{apt.time}</p>
                </div>
                {apt.rating && (
                  <div className="flex flex-col items-center">
                    <p className="text-xs font-semibold text-gray-400">Rating</p>
                    <p className="text-yellow-500 font-bold flex items-center">
                      {apt.rating} <span className="ml-1">★</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
